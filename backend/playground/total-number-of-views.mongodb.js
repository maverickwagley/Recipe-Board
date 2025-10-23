/* global use, db */

use('board-simulated')

db.getCollection('events').aggregate([
  {
    $match: { action: 'startView' },
  },

  {
    $group: {
      _id: '$post',

      views: { $count: {} },
    },
  },
])
