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
    }
};

const sign_mech_map = {
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
];
