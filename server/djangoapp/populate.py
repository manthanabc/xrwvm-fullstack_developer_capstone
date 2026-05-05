import json
from pathlib import Path
from .models import CarMake, CarModel


def _map_body_type(body_type):
    if not body_type:
        return CarModel.SEDAN
    normalized = body_type.strip().upper()
    if normalized in dict(CarModel.CAR_TYPE_CHOICES):
        return normalized
    return CarModel.SEDAN


def initiate():
    if CarMake.objects.exists():
        return

    base_dir = Path(__file__).resolve().parent.parent
    data_path = base_dir / "database" / "data" / "car_records.json"
    data = json.loads(data_path.read_text(encoding="utf-8"))

    for car in data.get("cars", []):
        make_name = car.get("make")
        model_name = car.get("model")
        if not make_name or not model_name:
            continue

        car_make, _ = CarMake.objects.get_or_create(
            name=make_name,
            defaults={"description": f"{make_name} vehicles"},
        )

        CarModel.objects.get_or_create(
            car_make=car_make,
            name=model_name,
            year=car.get("year", 2015),
            defaults={
                "type": _map_body_type(car.get("bodyType")),
                "dealer_id": car.get("dealer_id"),
                "mileage": car.get("mileage"),
            },
        )
