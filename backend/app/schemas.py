from datetime import date
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    full_name: str = Field(alias="fullName", min_length=1, max_length=160)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    model_config = ConfigDict(populate_by_name=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    user_id: int


class ProfileResponse(BaseModel):
    name: str
    email: EmailStr
    currency: str | None = None
    work_type: str | None = Field(default=None, serialization_alias="workType")
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ProfileUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    currency: str = Field(min_length=3, max_length=8)
    work_type: str = Field(alias="workType", min_length=1, max_length=40)
    model_config = ConfigDict(populate_by_name=True)


class IncomeInput(BaseModel):
    source: str = Field(min_length=1, max_length=160)
    amount: float = Field(ge=0)
    type: str = Field(min_length=1, max_length=30)


class ExpenseInput(BaseModel):
    category: str = Field(min_length=1, max_length=80)
    amount: float = Field(ge=0)
    description: str = Field(default="", max_length=240)


class DebtInput(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    lender: str = Field(default="", max_length=160)
    amount: float = Field(gt=0)
    interest_rate: float = Field(default=0, alias="interestRate", ge=0)
    due_date: date | None = Field(default=None, alias="dueDate")
    due_date_legacy: date | None = Field(default=None, alias="due_date")
    notes: str = Field(default="", max_length=2000)
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    @property
    def normalized_due_date(self) -> date | None:
        return self.due_date or self.due_date_legacy


class OnboardingRequest(BaseModel):
    work_type: str = Field(alias="workType", min_length=1, max_length=40)
    currency: str = Field(min_length=3, max_length=8)
    incomes: list[IncomeInput] = Field(default_factory=list, max_length=30)
    expenses: list[ExpenseInput] = Field(default_factory=list, max_length=100)
    debts: list[DebtInput] = Field(default_factory=list, max_length=30)
    model_config = ConfigDict(populate_by_name=True)


class TransactionInput(BaseModel):
    description: str = Field(min_length=1, max_length=240)
    amount: float = Field(gt=0)
    category: str = Field(min_length=1, max_length=80)
    date: date
    notes: str = Field(default="", max_length=2000)
    type: Literal["expense"] = "expense"


class DebtPatch(BaseModel):
    paid: bool


class TaxRequest(BaseModel):
    income: float = Field(gt=0)
    country: Literal["KE", "US", "UK", "NG"]


class TaxResponse(BaseModel):
    income: float
    tax: float
    rate: float
    net_income: float = Field(serialization_alias="netIncome")
    breakdown: list[dict[str, Any]]
    model_config = ConfigDict(populate_by_name=True)
