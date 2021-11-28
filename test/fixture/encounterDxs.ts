export default {
    "resourceType": "Bundle",
    "type": "searchset",
    "total": 3,
    "link": [
      {
        "relation": "self",
        "url": "https://test.fhir.com/server/Condition?patient=eZ5-7rYdWqgv3jSgIvx.SPw3&category=encounter-diagnosis&encounter=e4HmDpgXalRt8NNfFivM0Qg3"
      }
    ],
    "entry": [
      {
        "link": [
          {
            "relation": "self",
            "url": "https://test.fhir.com/server/Condition/eh8OUeGWAtnDo9VfNzyrFhpwHBMt-nFRfWjVKf7XAvrsxTmlxCLD70YGLpTlCxy57U0Qa9vSajV0-U6Bb7RBqqA3"
          }
        ],
        "fullUrl": "https://test.fhir.com/server/Condition/eh8OUeGWAtnDo9VfNzyrFhpwHBMt-nFRfWjVKf7XAvrsxTmlxCLD70YGLpTlCxy57U0Qa9vSajV0-U6Bb7RBqqA3",
        "resource": {
          "resourceType": "Condition",
          "id": "eh8OUeGWAtnDo9VfNzyrFhpwHBMt-nFRfWjVKf7XAvrsxTmlxCLD70YGLpTlCxy57U0Qa9vSajV0-U6Bb7RBqqA3",
          "category": [
            {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                  "code": "encounter-diagnosis",
                  "display": "Encounter Diagnosis"
                }
              ],
              "text": "Encounter Diagnosis"
            }
          ],
          "code": {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "59621000",
                "display": "Essential hypertension (disorder)"
              },
              {
                "system": "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                "code": "401.9",
                "display": "Essential hypertension"
              },
              {
                "system": "urn:oid:2.16.840.1.113883.6.90",
                "code": "I10",
                "display": "Essential hypertension"
              }
            ],
            "text": "Essential hypertension"
          },
          "subject": {
            "reference": "Patient/eZ5-7rYdWqgv3jSgIvx.SPw3",
            "display": "Ambulatory, Oliver"
          },
          "encounter": {
            "reference": "Encounter/e4HmDpgXalRt8NNfFivM0Qg3"
          }
        },
        "search": {
          "mode": "match"
        }
      },
      {
        "link": [
          {
            "relation": "self",
            "url": "https://test.fhir.com/server/Condition/eh8OUeGWAtnDo9VfNzyrFhsDouHvv0cNgx8ohkp.LcnGqoRizp-v4n35gTS0VrsvONVtqc8ho6zvGcJ5kZlTE7g3"
          }
        ],
        "fullUrl": "https://test.fhir.com/server/Condition/eh8OUeGWAtnDo9VfNzyrFhsDouHvv0cNgx8ohkp.LcnGqoRizp-v4n35gTS0VrsvONVtqc8ho6zvGcJ5kZlTE7g3",
        "resource": {
          "resourceType": "Condition",
          "id": "eh8OUeGWAtnDo9VfNzyrFhsDouHvv0cNgx8ohkp.LcnGqoRizp-v4n35gTS0VrsvONVtqc8ho6zvGcJ5kZlTE7g3",
          "category": [
            {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                  "code": "encounter-diagnosis",
                  "display": "Encounter Diagnosis"
                }
              ],
              "text": "Encounter Diagnosis"
            }
          ],
          "code": {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "110483000",
                "display": "Tobacco user (finding)"
              },
              {
                "system": "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                "code": "305.1",
                "display": "Tobacco use disorder"
              },
              {
                "system": "urn:oid:2.16.840.1.113883.6.90",
                "code": "F17.200",
                "display": "Tobacco use disorder"
              }
            ],
            "text": "Tobacco use disorder"
          },
          "subject": {
            "reference": "Patient/eZ5-7rYdWqgv3jSgIvx.SPw3",
            "display": "Ambulatory, Oliver"
          },
          "encounter": {
            "reference": "Encounter/e4HmDpgXalRt8NNfFivM0Qg3"
          }
        },
        "search": {
          "mode": "match"
        }
      },
      {
        "link": [
          {
            "relation": "self",
            "url": "https://test.fhir.com/server/Condition/eh8OUeGWAtnDo9VfNzyrFhjZCK3BFoxrx5XeKMLvCfCZaXXo1.wpDjceXxlC8wyOdJ6bVUkKfXXAKhkjmkwUfPw3"
          }
        ],
        "fullUrl": "https://test.fhir.com/server/Condition/eh8OUeGWAtnDo9VfNzyrFhjZCK3BFoxrx5XeKMLvCfCZaXXo1.wpDjceXxlC8wyOdJ6bVUkKfXXAKhkjmkwUfPw3",
        "resource": {
          "resourceType": "Condition",
          "id": "eh8OUeGWAtnDo9VfNzyrFhjZCK3BFoxrx5XeKMLvCfCZaXXo1.wpDjceXxlC8wyOdJ6bVUkKfXXAKhkjmkwUfPw3",
          "category": [
            {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                  "code": "encounter-diagnosis",
                  "display": "Encounter Diagnosis"
                }
              ],
              "text": "Encounter Diagnosis"
            }
          ],
          "code": {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "235595009",
                "display": "Gastroesophageal reflux disease (disorder)"
              },
              {
                "system": "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                "code": "530.81",
                "display": "GERD (gastroesophageal reflux disease)"
              },
              {
                "system": "urn:oid:2.16.840.1.113883.6.90",
                "code": "K21.9",
                "display": "GERD (gastroesophageal reflux disease)"
              }
            ],
            "text": "GERD (gastroesophageal reflux disease)"
          },
          "subject": {
            "reference": "Patient/eZ5-7rYdWqgv3jSgIvx.SPw3",
            "display": "Ambulatory, Oliver"
          },
          "encounter": {
            "reference": "Encounter/e4HmDpgXalRt8NNfFivM0Qg3"
          }
        },
        "search": {
          "mode": "match"
        }
      }
    ]
  } as object;