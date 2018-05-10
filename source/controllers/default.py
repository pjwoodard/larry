# -*- coding: utf-8 -*-
# -------------------------------------------------------------------------
# This is a sample controller
# this file is released under public domain and you can use without limitations
# -------------------------------------------------------------------------

# ---- example index page ----
def index():
    # Managing keys
    with Session() as session:
        print('*** objects (before) ***')
        session.list_all_objects()

        tmp = session.generate_aes(256, 'tmp', store=False)
        aes = session.generate_aes(256, 'aes')
        rsa = session.generate_rsa(1024, 'rsa')
        ec = session.generate_ec('prime192v2', 'ec')

        print('*** objects (after) ***')
        session.list_all_objects()

        print('*** encrypt/decrypt ***')

        iv = session.p11.generate_random(128)
        ciphertext = tmp.encrypt(b'Hello, world!', mechanism_param=iv)
        plaintext = tmp.decrypt(ciphertext, mechanism_param=iv)

        print("Cipher text: ", ciphertext)
        print("Plain text: ", plaintext.decode("utf-8"))

        print('*** deleting ***')

        session.destroy_by_label('aes')
        session.destroy_by_label('rsa')
        session.destroy_by_label('ec')

    return dict(keys={1, 2, 3})

# ---- API (example) -----
@auth.requires_login()
def api_get_user_email():
    if not request.env.request_method == 'GET': raise HTTP(403)
    return response.json({'status':'success', 'email':auth.user.email})

# ---- Smart Grid (example) -----
@auth.requires_membership('admin') # can only be accessed by members of admin groupd
def grid():
    response.view = 'generic.html' # use a generic view
    tablename = request.args(0)
    if not tablename in db.tables: raise HTTP(403)
    grid = SQLFORM.smartgrid(db[tablename], args=[tablename], deletable=False, editable=False)
    return dict(grid=grid)

# ---- Embedded wiki (example) ----
def wiki():
    auth.wikimenu() # add the wiki to the menu
    return auth.wiki()

# ---- Action for login/register/etc (required for auth) -----
def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    http://..../[app]/default/user/bulk_register
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    also notice there is http://..../[app]/appadmin/manage/auth to allow administrator to manage users
    """
    return dict(form=auth())

# ---- action to server uploaded static content (required) ---
@cache.action()
def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)
