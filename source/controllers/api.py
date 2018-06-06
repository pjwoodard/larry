@auth.requires_login()
def get_keys():
    if auth.user is None:
        redirect(URL('default', 'user/login'))

    query = (db.memos.user_email == auth.user.email)
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
        ))

    return response.json(dict(keys=keys))

def upload_file():
    print("We've made it into the upload URL")