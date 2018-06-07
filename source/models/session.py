import os
import pkcs11
from pkcs11 import Attribute, KeyType, ObjectClass
from pkcs11.util.ec import encode_named_curve_parameters

class Session:
    """
    Wraps python-pkcs11, providing convenient wrappers to some
    functions. Use the Session.p11 member to access all the
    python-pkcs11.session functions.

    Example use,
    with Session() as session:
        key = session.generate_aes(256, 'aes')
        session.list_all_objects()

    Alternatively, to keep the session open,
    session = Session()
    key = session.generate_aes(256, 'aes')
    session.list_all()
    session.close() # make sure to call this after to close the session
    """

    # Private static fields --------------------------------------------

    __aes_sizes = { 128, 192, 256 }
    """AES key sizes."""

    __dsa_sizes = { 1024, 2048, 3072 }
    """DSA key sizes."""

    __rsa_sizes = { 1024, 1536, 2048, 4096 }
    """RSA key sizes."""

    __ec_curves = {
        'prime192v2', 'prime192v3', 'prime239v1', 'sect163k1',
        'sect163r2', 'secp192r1', 'secp224r1', 'sect233k1', 'secp256r1',
        'sect233r1', 'sect283k1', 'sect283r1', 'secp384r1', 'sect409k1',
        'sect409r1', 'secp521r1', 'sect571k1', 'sect571r1',
    }
    """
    Our supported EC curves.

    All supported python-pkcs11 curves:
    https://github.com/wbond/asn1crypto/blob/master/asn1crypto/keys.py
    """

    # Initialization ---------------------------------------------------

    def __init__(self,
                 lib_path=os.environ['PKCS11_LIBRARY_PATH'],
                 token_label='larry',
                 pin='1234'):
        """
        Session constructor.

        @param lib_path: P11 library path.
        @param token_label: Label of p11 token.
        @param pin: Pin corresponding to our p11 token.
        """
        self.__lib_path = lib_path
        self.__token_label = token_label
        self.__pin = pin
        self.lib = pkcs11.lib(self.__lib_path)
        self.token = self.lib.get_token(token_label=self.__token_label)
        self.p11 = self.token.open(user_pin=self.__pin, rw=True)

    def __enter__(self):
        return self

    # Clean up ---------------------------------------------------------

    def close(self):
        """ Closes the internal session. """
        self.p11.close()

    def __exit__(self, exception_type, exception_value, traceback):
        self.close()

    # Object manipulation ----------------------------------------------

    def list_objects(self, template):
        """
        Prints objects with attributes that match attributes listed in
        template.

        @param template: The template to match with.
        """
        for obj in self.get_objects(template):
            print(obj)

    def list_all_objects(self):
        """ Prints all data, certificates, and keys on the HSM. """
        self.list_objects({Attribute.CLASS: ObjectClass.DATA})
        self.list_objects({Attribute.CLASS: ObjectClass.CERTIFICATE})
        self.list_objects({Attribute.CLASS: ObjectClass.SECRET_KEY})
        self.list_objects({Attribute.CLASS: ObjectClass.PUBLIC_KEY})
        self.list_objects({Attribute.CLASS: ObjectClass.PRIVATE_KEY})

    def get_objects(self, template):
        """
        Returns objects with attributes that match the template. Just
        a dummy wrapper for the internal p11 session get_objects call.

        @param template: The template to match with.
        @return: A list of objects.
        """
        return self.p11.get_objects(template)

    def destroy_objects(self, template):
        """
        Destroys objects with attributes that match the template.

        @param template: The template to match with.
        """
        for obj in self.get_objects(template):
            obj.destroy()

    def destroy_by_label(self, label):
        """
        Destroys all objects with matching label. Remove when we have
        unique ids (associated with the user db).

        @param label: The label to match and delete.
        """
        self.destroy_objects({Attribute.LABEL: label})

    def destroy_by_id(self, object_id):
        """
        Destroys all objects with matching id.

        @param label: The label to match and delete.
        """
        self.destroy_objects({Attribute.ID: object_id})

    # Key generation ---------------------------------------------------

    def generate_aes(self, size, label, object_id='', store=True):
        """
        Generates an AES key.

        @param size: The size of the key.
        @param label: The label of the key.
        @param object_id: The unique identifier of the key.
        @raise ValueError: Raised when an invalid key size is passed.
        @return: The key.
        """
        if size not in Session.__aes_sizes:
            raise ValueError('Invalid AES key size.')

        return self.p11.generate_key(KeyType.AES,
                                     size,
                                     template={
                                        Attribute.ID: object_id,
                                        Attribute.LABEL: label,
                                     },
                                     store=store)

    def generate_rsa(self, size, label, object_id='', store=True):
        """
        Generates an RSA key.

        @param size: The size of the key.
        @param label: The label of the key.
        @param object_id: The unique identifier of the key.
        @raise ValueError: Raised when an invalid key size is passed.
        @return: The key.
        """
        if size not in Session.__rsa_sizes:
            raise ValueError('Invalid RSA key size.')
        return self.p11.generate_keypair(KeyType.RSA,
                                         size,
                                         label=label,
                                         id=object_id,
                                         store=store)

    def generate_dsa(self, size, label, object_id='', store=True):
        """
        Generates a DSA key.

        @param size: The size of the key.
        @param label: The label of the key.
        @param object_id: The unique identifier of the key.
        @raise ValueError: Raised when an invalid key size is passed.
        @return: The key.
        """
        if size not in Session.__dsa_sizes:
            raise ValueError('Invalid DSA key size.')
        return self.p11.generate_keypair(KeyType.DSA,
                                         size,
                                         label=label,
                                         id=object_id,
                                         store=store)

    def generate_ec(self, curve, label, object_id='', store=True):
        """
        Generates an EC key.

        @param curve: The name of the desired elliptic curve.
        @param label: The label of the key.
        @param object_id: The unique identifier of the key.
        @raise ValueError: Raised when an invalid curve is passed.
        @return: The key.
        """
        if curve not in Session.__ec_curves:
            raise ValueError('Invalid EC curve.')
        parameters = self.p11.create_domain_parameters(KeyType.EC, {
            Attribute.EC_PARAMS: encode_named_curve_parameters(curve)
        }, local=True)
        return parameters.generate_keypair(label=label,
                                           id=object_id,
                                           store=store)
