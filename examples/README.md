# Examples
## Try out different types of shell servers.

#### To use any of these examples, you will need to generate host keys for the server.

To generate host keys in the examples directory:
```
# create a directory for our test keys
mkdir test_keys
cd test_keys
# generate the keys
ssh-kegen -f test_key -C ""
```


# README Example
Proof that the code in [../README.md](../README.md) works.

Connect to the server to recieve a message. The server will terminate the connection.

## Password Example
### Authenticate with a shared secret.
Provide a method that takes in a user-provided username and password. Return `Boolean` or a `Promise` that resolves to a `Boolean`. True indicates a successful login, false indicates a failed login. Rejection indicates an error.

We provide an example `checkPassword(username, password)` to get you started. (The password is *password*)

## Public Key Example
### Authenticate with a Public Key
To use this method, you must provide your public key via the environment variable `$USER_PUBLIC_KEY`.

Provide two methods to validate and verify public keys. Validation takes in the user-provided raw public key and asserts that the server will accept it.
Verification takes in a verifier determined by the user's key and the signature provided by the user.

We provide an example implementation that validates and verifies the login based on `process.env.USER_PUBLIC_KEY`.