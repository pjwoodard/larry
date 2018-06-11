@auth.requires_login()
@auth.requires_signature()
def generate_key():
    """
    Generates a key from http request using a temporary PKCS11 session.

    @param request.vars.size: The size (or curve) to use when generating key.
    @param request.vars.type: The type of key to generate [AES, RSA, DSA, EC].
    @param request.vars.label: A name for the key.

    """
    with Session() as session:
        generate = {
            'RSA': session.generate_rsa,
            'AES': session.generate_aes,
            'EC': session.generate_ec,
            'DSA': session.generate_dsa
        }[request.vars.type]

        size_or_curve = request.vars.size if request.vars.type == 'EC' else int(request.vars.size)
        key_id = None
        try:
            key = generate(
                size_or_curve,
                label=request.vars.label,
                object_id=str(auth.user.id)
            )
            key_id = db.user_keys.insert(
                p11_label=request.vars.label,
                p11_type=request.vars.type,
                p11_size_or_curve=size_or_curve
            )
            print(db(db.user_data).select())
        except:
            print("Error, unable to generate key.")

        session.list_all_objects()
        if key_id is not None:
            key = db(db.user_keys.id == key_id).select().first()
            return response.json(key)
    return response.json(dict(generate_key=None))

@auth.requires_login()
@auth.requires_signature()
def destroy_key():
    return response.json(dict(success=False))

@auth.requires_login()
@auth.requires_signature()
def destroy_everything():
    with Session() as session:
        session.destroy_all_objects()
    db(db.user_keys).delete()
    db(db.user_data).delete()
    return "ok"

def get_key_data(label):
    query = (db.user_keys.user_email == auth.user.email)
    query = query & (db.user_keys.p11_label == label)
    key = db(query).select().first()
    query = (db.user_data.id == key.data_id)
    return None if key is None else db(query).select().first()

def inc_data_entry(label, entry):
    success = False
    data = get_key_data(label)
    if data is not None:
        db(db.user_data.id == data.id).update(sign_count=data[entry]+1)
        success = True
        print(data)
    return success

@auth.requires_login()
@auth.requires_signature()
def key_data():
    data = get_key_data(request.vars.label)
    key_data = dict()
    if data is not None:
        key_data["signs"] = data.sign_count
        key_data["verifies"] = data.verify_count
        key_data["encrypts"] = data.encrypt_count
        key_data["decrypts"] = data.decrypt_count
    return response.json(key_data)

@auth.requires_login()
@auth.requires_signature()
def sign():
    object_class = ObjectClass.PRIVATE_KEY
    if request.vars.obj_type == "AES":
        object_class = ObjectClass.SECRET_KEY

    signed_data = None
    with Session() as session:
        signed_data = session.sign(
            object_class,
            request.vars.label,
            request.vars.object_id,
            request.vars.mech,
            request.vars.data,
        )

        # # For testing until we have crypt form
        # encrypted = session.encrypt(
        #     ObjectClass.PUBLIC_KEY,
        #     request.vars.label,
        #     request.vars.object_id,
        #     request.vars.mech,
        #     request.vars.data
        # )

        # print(encrypted)
        # print(session.decrypt(
        #     ObjectClass.PRIVATE_KEY,
        #     request.vars.label,
        #     request.vars.object_id,
        #     request.vars.mech,
        #     encrypted
        # ).decode('utf-8'))

        inc_data_entry(request.vars.label, "sign_count")

    print(signed_data)
    return response.json(dict(signed_data=signed_data))

@auth.requires_login()
@auth.requires_signature()
def verify():
    object_class = ObjectClass.PUBLIC_KEY
    if request.vars.obj_type == "AES":
        object_class = ObjectClass.SECRET_KEY

    print(request.vars.obj_type)
    print(request.vars.label)
    print(request.vars.object_id)
    print(request.vars.mech)
    print(request.vars.data)
    print(request.vars.signed_data)

    success = False
    with Session() as session:
        success = session.verify(
            ObjectClass.PUBLIC_KEY,
            request.vars.label,
            request.vars.object_id,
            request.vars.mech,
            request.vars.data,
            request.vars.signed_data
        )
        inc_data_entry(request.vars.label, "verify_count")
        print(success)

    return response.json(dict(is_valid_signature=success))

@auth.requires_login()
@auth.requires_signature()
def encrypt():
    object_class = ObjectClass.PUBLIC_KEY
    if request.vars.obj_type == "AES":
        object_class = ObjectClass.SECRET_KEY

    print(request.vars.obj_type)
    print(request.vars.label)
    print(request.vars.object_id)
    print(request.vars.mech)
    print(request.vars.data)
    print(request.vars.iv)


    encrypted_data = None
    with Session() as session:
        encrypted_data = session.encrypt(
            object_class,
            request.vars.label,
            request.vars.object_id,
            request.vars.mech,
            request.vars.data,
            bytes(request.vars.iv, "utf-8")
        )
        inc_data_entry(request.vars.label, "encrypt_count")

    print(encrypted_data)
    return response.json(dict(encrypted_data=encrypted_data))

@auth.requires_login()
@auth.requires_signature()
def decrypt():
    object_class = ObjectClass.PUBLIC_KEY
    if request.vars.obj_type == "AES":
        object_class = ObjectClass.SECRET_KEY

    print(request.vars.obj_type)
    print(request.vars.label)
    print(request.vars.object_id)
    print(request.vars.mech)
    print(request.vars.data)
    print(request.vars.iv)

    decrypted_data = None
    with Session() as session:
        decrypted_data = session.decrypt(
            object_class,
            request.vars.label,
            request.vars.object_id,
            request.vars.mech,
            request.vars.data,
            bytes(request.vars.iv, "utf-8")
        )
        inc_data_entry(request.vars.label, "decrypt_count")

    print(decrypted_data)
    return response.json(dict(decrypted_data=decrypted_data))

@auth.requires_login()
@auth.requires_signature()
def get_user_keys():
    if auth.user is None:
        redirect(URL('default', 'user/login'))

    # might need a refresh keys to query SoftHSM

    query = (db.user_keys.user_email == auth.user.email)
    rows = db(query).select()

    keys = []
    for i, row in enumerate(rows):
        keys.append(dict(
            id=row.id,
            p11_label=row.p11_label,
            p11_id=row.p11_id,
            p11_type=row.p11_type,
            p11_size_or_curve=row.p11_size_or_curve,
        ))

    return response.json(dict(keys=keys))
