1. Create a firebase project and a firestore database. In the database, add a collection titled `classes` and in that collection, create a document with the id `static`. The contents of the document is not important.

2. Generate a service account key from firebase project settings. Host it on any JSON hosting service (`jsonkeeper` used here) and set that as the value for the environment variable `GOOGLE_APPLICATION_CREDENTIALS`.

3. Set an environment variable `PASS` for the password you want to use.

Use the endpoint `/?pass=PASS` to be able to edit.