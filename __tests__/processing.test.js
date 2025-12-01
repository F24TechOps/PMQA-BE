import compareFields from "../clients/processing/fieldCheck/compareFields.js"
import mappingCheck from "../clients/processing/fieldCheck/checkMapping.js"
import stepCheck from "../clients/processing/fieldCheck/checkStepIncidents.js"
import getTransactionByID from "../clients/cyclr/transactions.js"


describe("Processing", () => {
    xdescribe("Compare Fields", () => {
        test("One expected field", () => {
            const testActualFields = {
                    items: [
                        {
                        emailAddress: "estherthetester@veryrealemail.com",
                        fields: {
                            firstname: "Esther",
                        },
                        },
                    ],
            };
            const testExpectedFields = [
                "firstname"
            ]
            // const testSummaryObj = {
            //     "furtherInvestigations": {"fields": []}, 
            //     "resultsObj": {
            //         "fields": {
            //             "firstname": {"status": "Correct", "value": "Esther"}
            //         }, 
            //         "summary": {
            //             "correct": 1, 
            //             "error": 0, 
            //             "extra": 0, 
            //             "missing": 0, 
            //             "null": 0, 
            //             "warning": 0
            //             }
            //         }
            //     }
            const testFunctionReturn = compareFields(testExpectedFields, testActualFields)
            expect(testFunctionReturn.resultsObj.summary.correct).toEqual(1)
            expect(testFunctionReturn.resultsObj.fields.firstname.status).toEqual("Correct")
            expect(testFunctionReturn.resultsObj.fields.firstname.value).toEqual(testActualFields.items[0].fields.firstname)

        })
        test("One unexpected field", () => {
            const testActualFields = {
                    items: [
                        {
                        emailAddress: "estherthetester@veryrealemail.com",
                        fields: {
                            firstname: "Esther",
                        },
                        },
                    ],
            };
            const testExpectedFields = [
                "lastname"
            ]
            const testFunctionReturn = compareFields(testExpectedFields, testActualFields)
            expect(testFunctionReturn.resultsObj.summary.extra).toEqual(1)
            expect(testFunctionReturn.resultsObj.fields.firstname.status).toEqual("Extra")
            expect(testFunctionReturn.furtherInvestigations.fields).toContain("lastname")
        })
        test("One null field", () => {
            const testActualFields = {
                    items: [
                        {
                        emailAddress: "estherthetester@veryrealemail.com",
                        fields: {
                            firstname: null,
                        },
                        },
                    ],
            };
            const testExpectedFields = [
                "firstname"
            ]
            const testFunctionReturn = compareFields(testExpectedFields, testActualFields)
            expect(testFunctionReturn.resultsObj.summary.null).toEqual(1)
            expect(testFunctionReturn.resultsObj.fields.firstname.status).toEqual("Null")
            expect(testFunctionReturn.furtherInvestigations.fields).toContain("firstname")

        })
        test("A combination of fields", () => {
            const testActualFields = {
                    items: [
                        {
                        emailAddress: "estherthetester@veryrealemail.com",
                        fields: {
                            firstname: null,
                            lastname: null,
                            jobtitle: "Boss",
                            mobilephone: "0121 1337 420",
                            extrafield1: "I am extra!",
                            extrafield2: "I am extra too!"
                        },
                        },
                    ],
            };
            const testExpectedFields = [
                "firstname",
                "lastname",
                "jobtitle",
                "mobilephone"
            ]

            const testFunctionReturn = compareFields(testExpectedFields, testActualFields)

            expect(testFunctionReturn.resultsObj.summary.correct).toEqual(2)
            expect(testFunctionReturn.resultsObj.summary.extra).toEqual(2)
            expect(testFunctionReturn.resultsObj.summary.null).toEqual(2)
            expect(testFunctionReturn.resultsObj.fields.firstname.value).toEqual(null)
            expect(testFunctionReturn.resultsObj.fields.lastname.value).toEqual(null)
            expect(testFunctionReturn.resultsObj.fields.jobtitle.value).toEqual("Boss")
            expect(testFunctionReturn.resultsObj.fields.mobilephone.value).toEqual("0121 1337 420")
            expect(testFunctionReturn.furtherInvestigations.fields).toContain("firstname")
            expect(testFunctionReturn.furtherInvestigations.fields).toContain("lastname")
        })
        test("Fields return a value regardless of case", () => {
            const testActualFields = {
                    items: [
                        {
                        emailAddress: "estherthetester@veryrealemail.com",
                        fields: {
                            firstName: "Testie", 
                        },
                        },
                    ],
            };
            const testExpectedFields = [
                "firstName",
            ]
            const testFunctionReturn = compareFields(testExpectedFields, testActualFields)
            expect(testFunctionReturn.resultsObj.summary.correct).toEqual(1)
            expect(testFunctionReturn.resultsObj.fields.firstname.value).toEqual("Testie")
        })      
    })
    xdescribe("Check Mapping", () => {
        test("One mapped extra field", async () => {
            const testActualFields = {
                    items: [
                        {
                        emailAddress: "estherthetester@veryrealemail.com",
                        fields: {
                            firstname: "Esther",
                        },
                        },
                    ],
            };
            const testExpectedFields = [
                "lastname"
            ]
            const testComparisonResults = compareFields(testExpectedFields, testActualFields)
            const testTransactionContext = {
                accountId: "7fcb9aae-c368-46cc-9fd2-4cba6184c90d",
                cycleId: "cb6ff75b-e87c-4602-b63e-d48b3f54ee5a"
            }
            const testCheckMappingOutput = await mappingCheck(testComparisonResults, testTransactionContext)
            expect(testCheckMappingOutput.resultsObj.summary.extra).toEqual(1)
            expect(testCheckMappingOutput.resultsObj.fields.firstname.status).toEqual("Extra")
            expect(testCheckMappingOutput.furtherInvestigations.fields[0].isMapped).toEqual(true)

        })
        test("One mapped null field", async () => { 
            const testActualFields = {
                    items: [
                        {
                        emailAddress: "estherthetester@veryrealemail.com",
                        fields: {
                            firstname: null,
                        },
                        },
                    ],
            };
            const testExpectedFields = [
                "firstname"
            ]
            const testComparisonResults = compareFields(testExpectedFields, testActualFields)
            const testTransactionContext = {
                accountId: "7fcb9aae-c368-46cc-9fd2-4cba6184c90d",
                cycleId: "cb6ff75b-e87c-4602-b63e-d48b3f54ee5a"
            }
            const testCheckMappingOutput = await mappingCheck(testComparisonResults, testTransactionContext)
            expect(testCheckMappingOutput.resultsObj.summary.null).toEqual(1)
            expect(testCheckMappingOutput.resultsObj.fields.firstname.status).toEqual("Null")
            expect(testCheckMappingOutput.furtherInvestigations.fields[0].isMapped).toEqual(true)
        })  
        xtest("One unmapped field", async () => {
            const testActualFields = {
                    items: [
                        {
                        emailAddress: "estherthetester@veryrealemail.com",
                        fields: {
                            firstname: "Esther",
                        },
                        },
                    ],
            };
            const testExpectedFields = [
                "firstname",
                "unmapped_field"
            ]
            const testComparisonResults = compareFields(testExpectedFields, testActualFields)
            const testTransactionContext = {
                accountId: "7fcb9aae-c368-46cc-9fd2-4cba6184c90d",
                cycleId: "cb6ff75b-e87c-4602-b63e-d48b3f54ee5a"
            }
            const testCheckMappingOutput = await mappingCheck(testComparisonResults, testTransactionContext)
            expect(testCheckMappingOutput.resultsObj.summary.missing).toEqual(1)
            expect(testCheckMappingOutput.resultsObj.fields.unmapped_field.status).toEqual("Missing")
        })
    })
    describe("Check Step Incidents", () => {
        test("Error 1 - No step response returned", async () => {
            const testMappingResults = {
                resultsObj: {
                fields: { firstname: { status: 'Null', value: null } },
                summary: { correct: 0, null: 1, missing: 0, warning: 0, error: 0, extra: 0 }
                },
                furtherInvestigations: {
                fields: [
                    {
                    id: 'firstname',
                    name: 'First Name',
                    mappingType: 'PreviousStep',
                    isMapped: true,
                    linkedSteps: [
                        {
                        stepId: '08ddf5f3-47e9-4060-8d2d-6e30d13cb81f',
                        fieldId: 27718270
                        }
                    ]
                    }
                ]
                }
            }
            const testTransactionContext = {
                accountId: "7fcb9aae-c368-46cc-9fd2-4cba6184c90d",
                cycleId: "cb6ff75b-e87c-4602-b63e-d48b3f54ee5a",
                transactionId: "52567071-13d9-4dcf-a97e-c19d4368c436",
            }
            const testFunctionReturn = await getTransactionByID(testTransactionContext.accountId, testTransactionContext.cycleId, testTransactionContext.transactionId)

            

            console.log(testFunctionReturn)
        })
    })
})