# NCMB CLI client

## Usage

### Init

```
$ ncmb init -a YOUR_APPLICATION_KEY -c YOUR_CLIENT_KEY
Config file saved successful.
```

### Script

```
$ ncmb script helloworld.js -m GET
{ body: '{"time":1461217641898,"mgs":"Hello World"}' }
```

```
$ ncmb script --help

  Usage: ncmb-script [options]

  Options:

    -h, --help                               output usage information
    -V, --version                            output the version number
    -a, --application_key [application_key]  Your application Key
    -c, --client_key [client_key]            Your client key
    -q, --query [Query String]               Query parameters
    -d, --data [Request body]                Request body
    -m, --method [type]                      Detect http method. GET/POST/PUT/DELETE
```

### DataStore

```
$ ncmb datastore list Item -i id,url -l 2 -s 2
┌──────────────────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────┐
│ id                                                               │ url                                                     │
├──────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 2e9c99eed2d45ca8a4765c9a74e299b6dace8172ca93bd462d8f73572d7856a0 │ http://feedproxy.google.com/~r/moongift/~3/MKH-6cquOfs/ │
├──────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 4bb066e541bc47acff3e9f45303d29dfb4fdc8d0a28f33b73d1446319eed54f5 │ http://feedproxy.google.com/~r/moongift/~3/sqiBbB-j7x8/ │
└──────────────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────┘
```

```
$ ncmb datastore list Item -i id -l 2 -s 2
┌──────────────────────────────────────────────────────────────────┐
│ id                                                               │
├──────────────────────────────────────────────────────────────────┤
│ 2e9c99eed2d45ca8a4765c9a74e299b6dace8172ca93bd462d8f73572d7856a0 │
├──────────────────────────────────────────────────────────────────┤
│ 4bb066e541bc47acff3e9f45303d29dfb4fdc8d0a28f33b73d1446319eed54f5 │
└──────────────────────────────────────────────────────────────────┘
```

```
$ ncmb datastore list --help

  Usage: ncmb-datastore-list [options]

  Options:

    -h, --help                               output usage information
    -V, --version                            output the version number
    -a, --application_key [application_key]  Your application Key
    -c, --client_key [client_key]            Your client key
    -l, --limit [number]                     Get the data numbers.
    -s, --skip [number]                      How skip data numbers.
    -e, --except [cloumns]                   Ignore cloumns
    -i, --include [cloumns]                  Include cloumns
```

