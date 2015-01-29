# To-Do List API Server 

## API Routes

* POST   /api/authenticate    (username, password)
* POST   /api/register        (username, password)
* POST   /api/task        C   (taskname, isdone)
* GET    /api/task        R   Get all my task
* GET    /api/task/:id    R   (_id, taskname, isdone, createddate, name)
* PUT    /api/task/:id    U   (_id, taskname, isdone, createddate)
* DEL    /api/task/:id    D   (_id)

## Test Case

Install all dependencies by
``` sh
npm install
```

Then run the server
``` sh
npm start
```

And have fun testing
``` sh
npm test
```

Be sure to check out the test case file in /testapi.js