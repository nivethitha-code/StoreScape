from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.branches import Branch
from schemas.branches import BranchBase, BranchCreate

router = APIRouter()

@router.get("/branches/")
def get_branches(db: Session = Depends(get_db)):
    return db.query(Branch).all()

@router.post("/branches/")
def create_branch(branch: BranchCreate, db: Session = Depends(get_db)):
    new_branch = Branch(**branch.dict())
    db.add(new_branch)
    db.commit()
    db.refresh(new_branch)
    return new_branch
