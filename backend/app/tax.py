from dataclasses import dataclass


@dataclass(frozen=True)
class Bracket:
    limit: float | None
    rate: float


BRACKETS: dict[str, tuple[Bracket, ...]] = {
    "KE": (Bracket(288000, 0.10), Bracket(388000, 0.25), Bracket(6000000, 0.30), Bracket(None, 0.35)),
    "US": (Bracket(11600, 0.10), Bracket(47150, 0.12), Bracket(100525, 0.22), Bracket(191950, 0.24), Bracket(None, 0.32)),
    "UK": (Bracket(12570, 0.0), Bracket(50270, 0.20), Bracket(125140, 0.40), Bracket(None, 0.45)),
    "NG": (Bracket(300000, 0.07), Bracket(600000, 0.11), Bracket(1100000, 0.15), Bracket(1600000, 0.19), Bracket(3200000, 0.21), Bracket(None, 0.24)),
}


def calculate_tax(income: float, country: str) -> dict:
    remaining = income
    previous_limit = 0.0
    tax = 0.0
    breakdown = []
    for bracket in BRACKETS[country]:
        taxable = remaining if bracket.limit is None else min(remaining, max(bracket.limit - previous_limit, 0))
        if taxable <= 0:
            break
        band_tax = taxable * bracket.rate
        tax += band_tax
        breakdown.append({"amount": round(taxable, 2), "rate": round(bracket.rate * 100, 2), "tax": round(band_tax, 2)})
        remaining -= taxable
        if remaining <= 0:
            break
        if bracket.limit is not None:
            previous_limit = bracket.limit
    return {
        "income": round(income, 2),
        "tax": round(tax, 2),
        "rate": round((tax / income) * 100, 2),
        "netIncome": round(income - tax, 2),
        "breakdown": breakdown,
    }
