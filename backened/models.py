# backend/models.py
from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class SubTask(BaseModel):
    title: str
    completed: bool = False

class Stats(BaseModel):
    strength: int = 1; stamina: int = 1; vitality: int = 1
    focus: int = 1; clarity: int = 1; willpower: int = 1; confidence: int = 1
    embedded_skill: int = 1; ai_ml_skill: int = 1; software_dev_skill: int = 1
    quantum_computing: int = 1 # Your new stat
    career: int = 1

class Condition(BaseModel):
    name: str
    type: str
    description: str

class Quest(Document):
    title: str; description: str; type: str; exp_grant: int = 10
    completed: bool = False; rank: str = "E"; stat_reward: Optional[str] = None
    stat_points: int = 0; duration_minutes: int = 0
    sub_tasks: List[SubTask] = []
    
    # --- THIS IS THE FIX ---
    class Settings:
        name = "quests"

class Skill(Document):
    name: str; tree: str; description: str; unlocked: bool = True
    
    # --- THIS IS THE FIX ---
    class Settings:
        name = "skills"

class Achievement(Document):
    title: str; description: str; unlocked: bool = True
    
    # --- THIS IS THE FIX ---
    class Settings:
        name = "achievements"

class HealthMetric(Document):
    date: str; mood: int = 5; sleep_quality: int = 5; water_intake: int = 0
    meditation_streak: int = 0; workout_streak: int = 0
    
    # --- THIS IS THE FIX ---
    class Settings:
        name = "health_metrics"

class InventoryItem(Document):
    name: str; type: str; description: str
    
    # --- THIS IS THE FIX ---
    class Settings:
        name = "inventory"

class MapChapter(Document):
    chapter: int; title: str; description: str; status: str = "locked"
    
    # --- THIS IS THE FIX ---
    class Settings:
        name = "map"

class Boss(Document):
    name: str; description: str; health: int = 100; defeated: bool = False
    
    # --- THIS IS THE FIX ---
    class Settings:
        name = "bosses"

class JournalEntry(Document):
    date: datetime = Field(default_factory=datetime.utcnow)
    category: str; content: str
    
    # --- THIS IS THE FIX ---
    class Settings:
        name = "journal_entries"

class Player(Document):
    username: str = "Laingam"; level: int = 1; exp: int = 0
    exp_to_next_level: int = 100; awakening_gauge: int = 0
    stats: Stats = Field(default_factory=Stats)
    conditions: List[Condition] = []
    active_skill_track: str = "software_dev_skill"
    
    # --- THIS IS THE FIX ---
    class Settings:
        name = "player"