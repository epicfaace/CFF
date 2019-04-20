import datetime
import re
from chalicelib.models import Response, UpdateTrailItem, PaymentStatusDetailItem, serialize_model
from bson.objectid import ObjectId
from pydash.objects import get, set_
from chalicelib.routes.responseIpnListener import mark_successful_payment
import dateutil

def response_edit(responseId):
    from ..main import app, TABLES
    response = Response.objects.get({"_id": ObjectId(responseId)})
    path = app.current_request.json_body["path"]
    value = app.current_request.json_body.get("value", None)
    if path.endswith(".checkin"):
        app.check_permissions(response.form, ["Responses_Checkin", "Responses_Edit"])
    else:
        app.check_permissions(response.form, "Responses_Edit")
    existing_value = get(response.value, path, value)
    if type(value) is str:
        if type(existing_value) is bool and value.lower() in ("true", "false"):
            value = value.lower() == "true"
        elif type(existing_value) is float and value.isdigit():
            value = float(value)
        elif type(existing_value) is int and value.isdigit():
            value = int(value)
    set_(response.value, path, value)
    response.update_trail.append(
        UpdateTrailItem(
            path=path,
            old_value=existing_value,
            new_value=value,
            date=datetime.datetime.now(),
            user=app.get_current_user_id()
        )
    )
    response.save()
    return {"res": {"success": True, "response": serialize_model(response)}}


def response_checkin(formId, responseId):
    pass

def response_payment(responseId):
    from ..main import app, TABLES
    response = Response.objects.get({"_id": ObjectId(responseId)})
    app.check_permissions(response.form, "Responses_Edit")
    amount = app.current_request.json_body["amount"]
    currency = app.current_request.json_body["currency"]
    date = app.current_request.json_body.get("date", None)
    if date and "$date" in date:
        date = dateutil.parser.parse(date["$date"])
    id = app.current_request.json_body["id"]
    method = app.current_request.json_body["method"]
    paid = mark_successful_payment(response.form, response, {"type": "manual", "method": method, "id": id}, method, amount, currency, id, date=date)
    response.save()
    return {"res": {"success": True, "paid": paid, "response": serialize_model(response)}}

def response_delete(responseId):
    from ..main import app, TABLES
    response = Response.objects.get({"_id": ObjectId(responseId)})
    app.check_permissions(response.form, "Responses_Delete")
    response.delete()
    return {"res": {"success": True, "response": serialize_model(response)}}