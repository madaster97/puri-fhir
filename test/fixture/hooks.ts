import draftOrders from './draftOrders';

const getRequest = (hook: string) => {
    return {
        hook,
        context: {
            userId: 'Practitioner/abc123',
            patientId: 'Patient/def456',
            draftOrders
        },
        hookInstance: 'abc123',
        prefetch: {
            myField: 'def456'
        }
    }
}
export default getRequest;