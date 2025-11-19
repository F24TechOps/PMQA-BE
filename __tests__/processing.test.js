import compareFields from "../clients/processing/fieldCheck/compareFields.js"
import mappingCheck from "../clients/processing/fieldCheck/checkMapping.js"


describe("Processing", () => {
    describe("Compare Fields", () => {
        test("One expected field returns summary object with 'correct' value", () => {
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
        test("One unexpected field returns summary object with 'extra' value and a populated further investigations object", () => {
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
        test("One null field returns summary object with 'null' value and a populated further investigations object", () => {
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
        test("A combination of fields returns summary object with values and a populated further investigations object", () => {
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
    describe("Check Mapping", () => {
        test("", () => {
        })
        test("", () => {  
        })
        test("", () => {  
        })
        test("", () => {  
        })
        test("", () => {  
        })
        test("", () => {  
        })
    })
})