export const generateUserErrorInfo = (user) =>{
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * firstName: need to be a string, received ${user.firstName}
    * lastName: need to be a string, received ${user.lastName}
    * email: need to be a string, received ${user.email}`

}