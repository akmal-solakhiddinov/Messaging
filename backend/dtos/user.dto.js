module.exports = class UserDto {
    id
    username
    email
    fullName
    lastLogin
    image
    status
    isActivated
    created
    account
    constructor(model) {
        this.id = model.id
        this.email = model.email
        this.username = model.username
        this.fullName = model.fullName
        this.status = model.status
        this.lastLogin = model.lastLogin
        this.image = model.image
        this.isActivated = model.isActivated
        this.created = model.created
        this.account = model.account
    }
}





