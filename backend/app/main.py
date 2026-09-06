from datetime import date
from decimal import Decimal

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .auth import create_access_token, get_current_user, hash_password, verify_password
from .config import get_settings
from .database import Base, engine, get_db
from .models import Debt, Income, Transaction, User
from .schemas import (
    DebtInput,
    DebtPatch,
    IncomeInput,
    LoginRequest,
    OnboardingRequest,
    ProfileResponse,
    ProfileUpdate,
    RegisterRequest,
    TaxRequest,
    TaxResponse,
    TokenResponse,
    TransactionInput,
)
from .tax import calculate_tax

settings = get_settings()
app = FastAPI(title="BalanceIQ API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def profile_response(user: User) -> ProfileResponse:
    return ProfileResponse(name=user.name, email=user.email, currency=user.currency, work_type=user.work_type)


@app.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    email = str(payload.email).lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")
    user = User(email=email, name=payload.full_name.strip(), password_hash=hash_password(payload.password))
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists") from None
    db.refresh(user)
    return TokenResponse(access_token=create_access_token(user.id), user_id=user.id)


@app.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == str(payload.email).lower()))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return TokenResponse(access_token=create_access_token(user.id), user_id=user.id)


@app.get("/auth/profile", response_model=ProfileResponse)
def get_profile(user: User = Depends(get_current_user)) -> ProfileResponse:
    return profile_response(user)


@app.put("/auth/profile", response_model=ProfileResponse)
def update_profile(payload: ProfileUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> ProfileResponse:
    user.name = payload.name.strip()
    user.currency = payload.currency.upper()
    user.work_type = payload.work_type
    db.commit()
    db.refresh(user)
    return profile_response(user)


@app.post("/auth/onboarding", response_model=ProfileResponse)
def onboarding(payload: OnboardingRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> ProfileResponse:
    user.currency = payload.currency.upper()
    user.work_type = payload.work_type
    user.incomes.clear()
    user.transactions.clear()
    user.debts.clear()
    for income in payload.incomes:
        user.incomes.append(Income(source=income.source.strip(), amount=Decimal(str(income.amount)), type=income.type))
    for expense in payload.expenses:
        user.transactions.append(Transaction(description=expense.description or expense.category, category=expense.category, amount=Decimal(str(expense.amount)), date=date.today(), notes="", type="expense"))
    for debt in payload.debts:
        user.debts.append(Debt(name=debt.name.strip(), lender=debt.lender, amount=Decimal(str(debt.amount)), due_date=debt.normalized_due_date, interest_rate=Decimal(str(debt.interest_rate)), notes=debt.notes, paid=False))
    db.commit()
    db.refresh(user)
    return profile_response(user)


@app.get("/transactions")
def list_transactions(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[dict]:
    items = db.scalars(select(Transaction).where(Transaction.user_id == user.id).order_by(Transaction.date.desc(), Transaction.id.desc())).all()
    return [transaction_json(item) for item in items]


@app.post("/transactions", status_code=status.HTTP_201_CREATED)
def create_transaction(payload: TransactionInput, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    item = Transaction(user_id=user.id, description=payload.description.strip(), category=payload.category, amount=Decimal(str(payload.amount)), date=payload.date, notes=payload.notes, type=payload.type)
    db.add(item)
    db.commit()
    db.refresh(item)
    return transaction_json(item)


@app.delete("/transactions/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> None:
    item = db.scalar(select(Transaction).where(Transaction.id == transaction_id, Transaction.user_id == user.id))
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    db.delete(item)
    db.commit()


@app.get("/debts")
def list_debts(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[dict]:
    items = db.scalars(select(Debt).where(Debt.user_id == user.id).order_by(Debt.paid.asc(), Debt.id.desc())).all()
    return [debt_json(item) for item in items]


@app.post("/debts", status_code=status.HTTP_201_CREATED)
def create_debt(payload: DebtInput, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    item = Debt(user_id=user.id, name=payload.name.strip(), lender=payload.lender, amount=Decimal(str(payload.amount)), due_date=payload.normalized_due_date, interest_rate=Decimal(str(payload.interest_rate)), notes=payload.notes)
    db.add(item)
    db.commit()
    db.refresh(item)
    return debt_json(item)


@app.patch("/debts/{debt_id}")
def update_debt(debt_id: int, payload: DebtPatch, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    item = db.scalar(select(Debt).where(Debt.id == debt_id, Debt.user_id == user.id))
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Debt not found")
    item.paid = payload.paid
    db.commit()
    db.refresh(item)
    return debt_json(item)


@app.delete("/debts/{debt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_debt(debt_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> None:
    item = db.scalar(select(Debt).where(Debt.id == debt_id, Debt.user_id == user.id))
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Debt not found")
    db.delete(item)
    db.commit()


@app.post("/tax/calculate", response_model=TaxResponse)
def tax(payload: TaxRequest, _: User = Depends(get_current_user)) -> dict:
    return calculate_tax(payload.income, payload.country)


def transaction_json(item: Transaction) -> dict:
    return {"id": item.id, "description": item.description, "category": item.category, "amount": float(item.amount), "date": item.date.isoformat(), "notes": item.notes, "type": item.type}


def debt_json(item: Debt) -> dict:
    return {"id": item.id, "name": item.name, "lender": item.lender, "amount": float(item.amount), "dueDate": item.due_date.isoformat() if item.due_date else "", "interestRate": float(item.interest_rate), "notes": item.notes, "paid": item.paid}
