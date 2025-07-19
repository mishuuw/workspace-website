class UserAlreadyExistsError(Exception):
    pass

class UserDoesNotExistError(Exception):
    pass

class WrongPasswordError(Exception):
    pass

class AccessForbiddenError(Exception):
    pass