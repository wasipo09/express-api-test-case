# Task Simple API
## API Routes

* POST   /api/authenticate    (username, password)
* POST   /api/register        (username, password)
* POST   /api/task        C   (taskname, isdone)
* GET    /api/task        R   Get all my task
* GET    /api/task/:id    R   (_id, taskname, isdone, createddate, name)
* PUT    /api/task/:id    U   (_id, taskname, isdone, createddate)
* DEL    /api/task/:id    D   (_id)

## Models
### Task Model


### User Model