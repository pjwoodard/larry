@auth.requires_login()
@auth.requires_signature()
def generate_key():
    return response.json(dict(generate_key=None))

@auth.requires_login()
@auth.requires_signature()
def destroy_key():
    return response.json(dict(success=False))

@auth.requires_login()
@auth.requires_signature()
def sign():
    return response.json(dict(signed_file=None))

@auth.requires_login()
@auth.requires_signature()
def verify():
    return response.json(dict(signed_file=None))

@auth.requires_login()
@auth.requires_signature()
def encrypt():
    return response.json(dict(encrypted_file=None))

@auth.requires_login()
@auth.requires_signature()
def decrypt():
    return response.json(dict(decrypted_file=None))

@auth.requires_login()
@auth.requires_signature()
def get_keys():
    if auth.user is None:
        redirect(URL('default', 'user/login'))

    query = (db.user_keys.user_email == auth.user.email)
    rows = db(query).select()

    keys = []
    for i, row in enumerate(rows):
        keys.append(dict(
            id=row.id,
            p11_label=row.p11_label,
            p11_id=row.p11_id,
            p11_type=row.p11_type,
            p11_size=row.p11_size,
            p11_curve=row.p11_curve
        )

    return response.json(dict(keys=keys))
