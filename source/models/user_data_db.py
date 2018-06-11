import datetime

def get_user_email():
    return auth.user.email if auth.user is not None else None

def get_user_id_str():
    return str(auth.user.id) if auth.user is not None else None

db.define_table(
    'user_data',

    Field('sign_count', 'integer', default=0),
    Field('verify_count', 'integer', default=0),
    Field('encrypt_count', 'integer', default=0),
    Field('decrypt_count', 'integer', default=0),

    Field('user_email', default=get_user_email()),
    Field('date_created', 'datetime', update=datetime.datetime.utcnow())
)

db.user_data.id.writeable = False
db.user_data.id.readable = False

db.user_data.sign_count.writeable = False
db.user_data.sign_count.readable = False
db.user_data.verify_count.writeable = False
db.user_data.verify_count.readable = False
db.user_data.encrypt_count.writeable = False
db.user_data.encrypt_count.readable = False
db.user_data.decrypt_count.writeable = False
db.user_data.decrypt_count.readable = False

db.user_data.user_email.writable = False
db.user_data.user_email.readable = False
db.user_data.date_created.writeable = False
db.user_data.date_created.readable = False
