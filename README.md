# Furcape

Service for segmenting users into different groups.

## The Name

Since I know Patrik will ask about the name I'll start with that. So I used a
thesuarus to look up cool words somewhat related to what we're doing here.

> Divide -> Bifurcate -> Furcate

I spun the idea of calling it "_BIFURCATOR2K_" or similar. But that felt a bit
overboard. And then for some reason my weird head came up with the wordplay:

> Furcate -> Furcape

And here we are. It sounds funny and has a somewhat "logical" explanation.
(If someone actually tells you that is.)

## The Mission

Provide a service for creating groups with different criterias that users are
then segmented into. One such criteria could be "member since" or "10% of
users".

## The Architecture

It feels important to make the system extensible. Adding new kinds of criterias
should be easy. And we should not rely on one single backend for user data.

### Criteria

A criterion is implemented as an object that provides a function for evaluating
a user against it's rules. It also has a function that is used to generate the
form presented to an admin that creates a group.

Here's an example:

```javascript
//
// # Constructor
//
var criterion = module.exports = function () {
  // Any constructor logic that needs to be performed, if any.
  // Setting default options etc.
};

//
// # Evaluate
//
// This function is called to see if a user matches the specific rules set or
// not.
//
// * **user**, a user object.
// * **options**, the options set in the interface when adding this criterion
//   to a group.
// * **group**, the group object this criterion belongs to.
// * **callback**, a function with the signature `function (err, result)`. If
//   the user does not match the criteria pass the `err` variable. Further
//   evaluation will be cancelled and the user will be deemed _not_ a part of
//   the group. The `result` variable may be either `true` or `false`. All
//   other rules in the group will be evaluated. A `false` result does _not_
//   mean that the user does not belong to the group, only that this current
//   criterion was not applicable. If all rules in a group return
//   `not applicable` the user will not be a part of the group. If one or more
//   critiera return `true` the user will be a part of the group.
criterion.prototype.evaluate = function evaluate(user, options, group, callback) {
  var belongs = (~~(Math.random() * options.min) + options.max) > options.limit;
  callback(null, belongs);
};

//
// # Form
//
// Should return an object specifying the input data this criterion needs.
//
criterion.prototype.form = function form() {
  return {
    // @TODO: To be specified.
  };
};
```
### Users

A user is represented by an object that is provided by the "user plugin". The
user plugin architecture is a way to decouple input data from _Furcape_.

The user object might look something like this:

```javascript
{
  id: 1235,
  name: "Superman",
  date_joined: 123456789
}
```

That's all we need for now, might be extended in the future.

### Groups

Groups are defined in the administration UI and result in an object looking
like this:

```javascript
{
  title: "10% of users joined after 1/1 2014",
  name: "10_percent",
  uuid: "23456flfzuih3riuh",
  active: true,
  critiera: [
    {
      type: "percent",
      options: {
        amount: 10
      }
    },
    {
      type: "membersince",
      options: {
        date: 134567890
      }
    }
  ]
}
```

## The API

_Furcape_ provides one single endpoint for implementers; The one to get the
groups a specific user belongs to.

### `GET /user/:id/groups`

_According to the spec it's `/abtest/user/:id/groups` but I think the routing
can take care of that part. Feels weird to namespace one endpoint in a lonely
server._

_Furcape_ will pass the `:id` to the user plugin which fetches a user object
matching that ID. The user object is then run through all of the active groups.

The result is an array of groups the user belongs to and the server responds
with this array. If the user belongs to no groups an empty array is sent back.

```javascript
["10_percent", "a", "new_feed"]
```

