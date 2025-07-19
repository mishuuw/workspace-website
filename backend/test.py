from utils.security import *

pwd = "abcdef123"
pwd_hash = get_password_hash(pwd)
print(pwd_hash)
print(verify_password(pwd, pwd_hash))
print(verify_password("abcdef12", pwd_hash))