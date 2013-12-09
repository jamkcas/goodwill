# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Deed.create(category: 'deed', deed_type: 'donation', title: 'Feed a homeless person', description: 'feed a homeless person', deadline: 'null', location: 'null', contact: 'null', contact_type: 'null', picture: 'null', user_id: 1)
Deed.create(category: 'deed', deed_type: 'service', title: 'Help a kid', description: 'Help a kid with their homework', deadline: 'null', location: 'null', contact: 'null', contact_type: 'null', picture: 'null', user_id: 1)
Deed.create(category: 'help', deed_type: 'donation', title: 'Levons Light', description: 'Donate to a bring awareness to film', deadline: 'jan 1, 2014', location: 'san mateo, ca, 94402', contact: 'j@j.com', contact_type: 'email', picture: 'null', user_id: 1)
Deed.create(category: 'help', deed_type: 'service', title: 'My Grandfather', description: 'help my grandfather with chores', deadline: 'ongoing', location: 'san mateo, ca, 94401', contact: '555-555-5555', contact_type: 'phone', picture: 'null', user_id: 1)

