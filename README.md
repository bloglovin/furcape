# Furcape

Group objects based on a set of criteria.

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

Provide a simple interface for defining groups of criteria and test objects
against those groups.

### Criteria

A critera is implemented as an object that provides a function for evaluating
a user against it's rules. It also has a function that is used to generate the
form presented to an admin that creates a group.

Here's an example:

```javascript
//
// # Constructor
//
var critera = module.exports = function () {
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
// * **options**, the options set in the interface when adding this critera
//   to a group.
// * **group**, the group object this critera belongs to.
// * **callback**, a function with the signature `function (err, result)`. If
//   the user does not match the criteria pass the `err` variable. Further
//   evaluation will be cancelled and the user will be deemed _not_ a part of
//   the group. The `result` variable may be either `true` or `false`. All
//   other rules in the group will be evaluated. A `false` result does _not_
//   mean that the user does not belong to the group, only that this current
//   critera was not applicable. If all rules in a group return
//   `not applicable` the user will not be a part of the group. If one or more
//   critiera return `true` the user will be a part of the group.
critera.prototype.evaluate = function evaluate(user, options, group, callback) {
  var belongs = (~~(Math.random() * options.min) + options.max) > options.limit;
  callback(null, belongs);
};

//
// # Form
//
// Should return an object specifying the input data this critera needs.
//
critera.prototype.form = function form() {
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

