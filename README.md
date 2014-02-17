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
a user against it's rules.

See the bundled criteria in the `lib`-directory for references. The required
methods are `test()` and `getName()`.

The test method is allowed to return an array of groups as it's result. This
makes it possible to create mutually exclusive groups etc (see the _Percentage_
criteria).

### Groups

Groups are objects with a `title`, a `name`, an automatically assigned `uuid`,
and a list of different criteria that

```javascript
{
  title: "10% of users joined after 1/1 2014",
  name: "10_percent",
  uuid: "23456flfzuih3riuh",
  active: true,
  critiera: [
    {
      type: "percentage",
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

There are mainly three methods on _Furcape_ that you need to concern yourself
with.

### `.registerCriteria(criteria)`

Register a new criteria that can be used when creating groups. **criteria**
should be an object constructor.

Criteria names needs to be unique, as such an error will be thrown if you try
to register an already taken name.

### `.createGroup(title, name, criteria)`

Adds a new group to the set of tests. A group is a group of criteria. An object
is said to belong to a group if it passes all the group's criteria.

This example will crete a group that will pass 10% of all data objects tested
with a property called `date` whose value is a date after `after`.

```javascript
var furscape = furscape();

furscape.createGroup('10% of newer then yesterday', '10p_new', {
  datetime: {
    dateName: 'data.date',
    after: yesterdaysDateAsTimestamp
  },
  percentage: {
    percent: 10
  }
});
```

### `.evaluate(data, [groups], fn)`

Tests the given object `data` against all the defined groups. The result is
passed to `fn`. If you'd like to test against only a subset of groups you pass
an array of strings as the second argument and the callback as the third.

The `fn` is a function that takes an error first, which is only passed if the
test completely breaks. The other argument is an array of the groups that the
given data belongs to.

Given the above group example this code would pass 10% of the objects with
a date after yesterday.

```javascript
var data = [
  { date: twoDaysAgo },
  { date: tomorrow },
  { date: twoDaysAgo },
  { date: tomorrow },
  { date: twoDaysAgo },
  { date: tomorrow },
  { date: twoDaysAgo },
  { date: twoDaysAgo },
  { date: tomorrow },
  { date: tomorrow },
  { date: tomorrow },
];

data.forEach(function (item) {
  // Would of course work poorly due to the async nature of `evaluate()`.
  // Purely an example
  furcape.evaluate(item, function (err, groups) {
    // If `item` had a date of `tomorrow` groups would contain `10p_new` about
    // 10% of the time. Since this is such a small dataset the percenage will
    // probably vary greatly though.
  });
});
```

## The Bundled Criteria

The _examples_ below show how the criteria can be used when defining a group.

### Percentage

Creates a hash of the given properties and then creates a 16bit integer which
is then used to determine if an object should pass the test or not. Include
a property unique to the group or something like that to make sure the same
data object is not put in the same bucket everytime (if for example creating
A/B-test groups and you want the same user to end up in different subsets every
time you create a new group.)

Can either just pass X% of objects or divide objects into groups.

**Pass X% example**
```
{
  // will use `id` from passed data object and `uuid` from group to create hash
  hashProps: ['data.id', 'group.uuid'],
  // will pass 25% of obejcts
  percent: 25
}
```

**Divide data into groups example**
```
{
  // will use `id` from passed data object and `uuid` from group to create hash
  hashProps: ['data.id', 'group.uuid'],
  ranges: {
    // Put 10% of objects in `group_a` and 30% of objects in `group_b`. Fail
    // the other 60%
    group_a: { min: 0, max: 10 },
    group_b: { min: 10.001, max: 40 }
  }
}
```

### Compare

Compare can be used to compare _numbers_ against each other. Every comparison
needs an `a` and a `b`. Where `a` is compared to `b`.

**Less than example**
```
{
  lessThan: {
    // A is a number passed in on the data object
    a: 'data.magicNumber',
    // B is a number specified here in the options
    b: 'options.limit',
  },
  limit: 30
}
```

Available tests are `lessThan`, `lessThanEqual`, `greaterThan` and
`greaterThanEqual`. They are exactly what they sound like and can be used in
conjuction on one group.

**Many rules example**
```
{
  // data.magicNumber must be less than 30
  lessThan: {
    // A is a number passed in on the data object
    a: 'data.magicNumber',
    // B is a number specified here in the options
    b: 'options.limit',
  },
  limit: 30,

  // But greater or equal to data.x
  greaterThanEqual: {
    a: 'data.magicNumber',
    b: 'data.x'
  }
}
```

### Datetime

Allows you to compare dates. You can currently see if a date is `before` or
`after` any given date.

**Date example**
```
{
  dateName: 'data.last_login',
  after: yesterday,
  before: tomorrow
}
```

### Equality

Used to determine if to properties are equal.

```
{
  a: 'data.name',
  b: 'group.name'
}
```

