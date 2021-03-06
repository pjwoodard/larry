import datetime

def get_user_email():
    return auth.user.email if auth.user is not None else None

def get_user_id_str():
    return str(auth.user.id) if auth.user is not None else None

db.define_table(
    'user_keys',

    Field('p11_label'),
    Field('p11_type'),
    Field('p11_size_or_curve'),
    Field('p11_id', default=get_user_id_str()),

    Field('data_id', default=db.user_data.insert()),

    Field('user_email', default=get_user_email()),
    Field('date_created', 'datetime', update=datetime.datetime.utcnow())
)

db.user_keys.id.writeable = False
db.user_keys.id.readable = False

db.user_keys.p11_label.writeable = False
db.user_keys.p11_label.readable = False
db.user_keys.p11_id.writeable = False
db.user_keys.p11_id.readable = False
db.user_keys.p11_type.writeable = False
db.user_keys.p11_type.readable = False
db.user_keys.p11_size_or_curve.writeable = False
db.user_keys.p11_size_or_curve.readable = False

db.user_keys.user_email.writable = False
db.user_keys.user_email.readable = False
db.user_keys.date_created.writeable = False
db.user_keys.date_created.readable = False
