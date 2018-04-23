"""
python -m unittest tests.unit.test_email
"""
from chalicelib.util.formSubmit.emailer import send_confirmation_email
# import tests.config
from tests.integration.constants import _
import unittest
from botocore.exceptions import ClientError
CONFIRMATION_EMAIL_INFO = {
    "cc": None,
    "image": "http://omrun.cmsj.org/wp-content/uploads/2017/01/cropped-Om-run-512px.png",
    "showResponse": False,
    "modifyLink": "onions",
    "showModifyLink": True,
    "subject": "CFF Unit Testing Form\n Confirmation",
    "toField": "email",
    "fromName": "Test",
    "from": "ccmt.dev@gmail.com",
    "message": "Thank you for your registration. You are registering for Training and Not for OmRun; OmRun registration will open in the first quarter of 2018."
}

TO_EMAIL = "success@simulator.amazonses.com"

RESPONSE = {
    "value": {"email": TO_EMAIL},
    "paymentInfo": {
      "currency": "USD",
      "total": 500,
      "redirectUrl": "onions",
      "items": [
        {
          "name": "name",
          "description": "description",
          "quantity": 1,
          "amount": 12.00
        }
      ]
    }
}

EXPECTED_RES = {
    'toEmail': ['success@simulator.amazonses.com'],
    'fromEmail': 'ccmt.dev@gmail.com',
    'fromName': 'Test',
    'subject': 'CFF Unit Testing Form\n Confirmation',
    'bccEmail': '',
    'ccEmail': None,
    'msgBody': "<h1>CFF Unit Testing Form\n Confirmation</h1><img class='mainImage' src='http://omrun.cmsj.org/wp-content/uploads/2017/01/cropped-Om-run-512px.png' />Thank you for your registration. You are registering for Training and Not for OmRun; OmRun registration will open in the first quarter of 2018.<br><br><table class=paymentInfoTable><tr><th>Name</th><th>Description</th><th>Amount</th><th>Quantity</th></tr><tr><td>name</td><td>description</td><td>$12.00</td><td>1</td></tr></table><br><br><h2>Total Amount: $500.00</h2><br><h2>Amount Received: $0.00</h2>",
}

class TestEmail(unittest.TestCase):
    maxDiff = None
    def test_send_email_paymentInfo_undefined(self):
        pass
        # send_confirmation_email({"value": {"email": TO_EMAIL}}, CONFIRMATION_EMAIL_INFO)

    def test_send_email_success(self):
        res = send_confirmation_email(RESPONSE, CONFIRMATION_EMAIL_INFO)
        self.assertEqual(res, EXPECTED_RES)
    
    def test_send_email_multiple_one_email_not_found(self):
        """ One email will be None -- it should not include this email here."""
        confirmationEmailInfo = dict(
            CONFIRMATION_EMAIL_INFO, **{"toField": ["email", "email2"]})
        res = send_confirmation_email(RESPONSE, confirmationEmailInfo)
        self.assertEqual(res, dict(EXPECTED_RES, **{"toEmail": [TO_EMAIL, None]}))

    def test_send_email_multiple_to(self):
        confirmationEmailInfo = dict(
            CONFIRMATION_EMAIL_INFO, **{"toField": ["email", "email2"]})
        response = dict(RESPONSE)
        response["value"] = {"email": TO_EMAIL, "email2": TO_EMAIL}
        res = send_confirmation_email(response, confirmationEmailInfo)
        self.assertEqual(res, dict(EXPECTED_RES, **{"toEmail": [TO_EMAIL, TO_EMAIL]}))

    def test_send_email_cc_bad_email(self):
        confirmationEmailInfo = dict(
            CONFIRMATION_EMAIL_INFO, **{"cc": "bad_email"})
        with self.assertRaises(ClientError):
            send_confirmation_email(RESPONSE, confirmationEmailInfo)
