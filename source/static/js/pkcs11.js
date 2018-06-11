const all_dgsts = [
    "MD5",
    "SHA_1",
    "SHA224",
    "SHA256",
    "SHA384",
    "SHA512",
];

const encr_mech_map = {
    AES: {
        AES_CBC_PAD: null,
    },

    DSA: {},

    RSA: {
        RSA_PKCS: null,
        RSA_PKCS_OAEP: null,
        RSA_X_509: null
    }
};

const sign_mech_map = {
    AES: {},

    DSA: {
        DSA: all_dgsts,
        DSA_SHA1: null,
        DSA_SHA224: null,
        DSA_SHA256: null,
        DSA_SHA384: null,
        DSA_SHA512: null,
    },

    EC: {
        ECDSA: all_dgsts,
    },

    RSA: {
        RSA_PKCS: all_dgsts,
        RSA_X509: all_dgsts,
        MD5_RSA_PKCS: null,
        SHA1_RSA_PKCS: null,
        SHA224_RSA_PKCS: null,
        SHA256_RSA_PKCS: null,
        SHA384_RSA_PKCS: null,
        SHA512_RSA_PKCS: null,
    },
};

const size_or_curve_map = [ 
        {
            type: "AES",
            sizes: ["128", "192", "256"]
        },
        {
            type: "RSA",
            sizes: ["1024", "1536", "2048", "4096"]
        },
        {
            type: "DSA",
            sizes: ["1024", "2048", "3072"]
        },
        {
            type: "EC",
            sizes:
            [
                'prime192v2', 'prime192v3', 'prime239v1', 'sect163k1',
                'sect163r2', 'secp192r1', 'secp224r1', 'sect233k1', 'secp256r1',
                'sect233r1', 'sect283k1', 'sect283r1', 'secp384r1', 'sect409k1',
                'sect409r1', 'secp521r1', 'sect571k1', 'sect571r1'
            ]
        }
];
