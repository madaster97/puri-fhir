export default {
    "resourceType": "Bundle",
    total: 2,
    entry: [
        {
            resource: {
                status: 'draft',
                resourceType: 'MedicationRequest',
                id: '123',
                medicationReference: {
                    reference: 'Medication/def456',
                    display: 'Ibuprofen'
                }
            },
            search: {
                mode: 'match'
            }
        },
        {
            resource: {
                status: 'draft',
                resourceType: 'ServiceRequest',
                id: '123',
                code: {
                    coding: [
                        { system: 'cpt', code: '42', display: 'Mammogram'
                        }
                    ],
                    text: 'Mammogram'
                }
            },
            search: {
                mode: 'match'
            }
        }
    ]
} as Object;