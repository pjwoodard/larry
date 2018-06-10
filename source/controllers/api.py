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
    return "ok"

@auth.requires_login()
@auth.requires_signature()
def sign():
    object_class = ObjectClass.PRIVATE_KEY
    if request.vars.obj_type == "AES":
        object_class = ObjectClass.SECRET_KEY

    print(request.vars.obj_type)
    print(request.vars.label)
    print(request.vars.object_id)
    print(request.vars.mech)
    print(request.vars.data)

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
            ObjectClass.PUBLIC_KEY,
            request.vars.label,
            request.vars.object_id,
            request.vars.mech,
            request.vars.data,
            request.vars.iv
        )

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
            ObjectClass.PUBLIC_KEY,
            request.vars.label,
            request.vars.object_id,
            request.vars.mech,
            request.vars.data,
            request.vars.iv
        )

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
