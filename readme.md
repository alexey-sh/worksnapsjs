## API

### Projects
 - getAll
 - getById (projectId)
 
### Users
 - getMe

   
### User Assignments
 - get (projectId)

### Time Entries
- getReports(options)
  - options.projectId (String)
  - options.type (String `time_entries` || `time_summary`)
  - options.usersIds (Array of string)
  - options.from (Date)
  - options.to (Date)

-

### All entities are supports
 - get (url, query, data)
 - post (url, query, data)
 - put (url, query, data)
 - remove (url, query, data)

where:
 - `url` which you want to add after `http://worksnaps.net/api/projects` (assume project instance)
 - `query` is optional object 
 - `data` is optional

## Examples

```
var client = new ws.Client(apiToken)
var users = new ws.Users(client);
users.getMe().then(function (data) {
  console.log(data);
});

var timeEntries = new ws.TimeEntries(client);
timeEntries.getReports({
  projectId: projectId,
  from: dateFrom,
  to: dateTo,
  type: 'time_summary',
  usersIds: [123]
}).then(function (data) {
  console.log(data);
}).catch(function (err) {
  console.error(err);
});
```
