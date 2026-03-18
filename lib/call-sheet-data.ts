export type CallSheetEntry = {
  id: number
  name: string
  unitNumber: string
  equipment: string
  start: string
  wrap: string
  rate: string
  po: string
  vendor: string
  notes: string
  section: 'ON_PRODUCTION' | 'OFF_PRODUCTION' | 'EO_EQUIPMENT' | 'CONDORS_LIFTS' | 'SERVICES' | 'SELF_DRIVE'
}

export type Driver = {
  id: number
  name: string
  union: string
  phone: string
  email: string
  vehicle: string
}

export const callSheetData: CallSheetEntry[] = [
  // ON PRODUCTION
  { id: 1, name: 'James Beato', unitNumber: 'Van-377', equipment: 'Sprinter Van #1', start: '10/1', wrap: '5/15', rate: '$850.00/wk', po: '92', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 2, name: 'Brian Gregory', unitNumber: 'Van-156', equipment: 'Sprinter Van #2', start: '10/27', wrap: '5/13', rate: '$850.00/wk', po: '534', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 3, name: 'Jose Alfonso', unitNumber: 'Van-385', equipment: 'Sprinter Van #3', start: '10/30', wrap: '5/11', rate: '$850.00/wk', po: '535', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 4, name: 'Robert Ballentine', unitNumber: 'Van-271', equipment: 'Sprinter Van #4', start: '10/30', wrap: '5/11', rate: '$850.00/wk', po: '949', vendor: 'B.I.', notes: 'OLD PO# 536 & UNIT 397', section: 'ON_PRODUCTION' },
  { id: 5, name: 'Tim Berry', unitNumber: 'Van-304', equipment: 'Sprinter Van #5', start: '10/30', wrap: '5/11', rate: '$850.00/wk', po: '613', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 6, name: 'Sean Marshall', unitNumber: 'Van-338', equipment: 'Sprinter Van #6', start: '10/30', wrap: '5/11', rate: '$850.00/wk', po: '537', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 7, name: 'Jonathon Lawrence', unitNumber: 'DC-503', equipment: 'Honeywagon', start: '10/30', wrap: '5/11', rate: '$2,900.00/wk', po: '614', vendor: 'B.I.', notes: '8 HW-107', section: 'ON_PRODUCTION' },
  { id: 8, name: 'Bubz Thrift', unitNumber: 'PV-613', equipment: '1600 Amp Production Van Tractor #1', start: '10/27', wrap: '5/15', rate: '$2,500.00/wk', po: '476', vendor: 'B.I.', notes: 'Re Rate to GennyOp', section: 'ON_PRODUCTION' },
  { id: 9, name: '', unitNumber: 'WT-102', equipment: "53' Wardrobe Trailer", start: '', wrap: '', rate: '$2,200.00/wk', po: '475', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 10, name: 'Chris Alexander', unitNumber: 'BD-003', equipment: '3 Axle Tractor #1', start: '10/29', wrap: '5/15', rate: '$1,050.00/wk', po: '387', vendor: 'B.I.', notes: 'Co-Captain', section: 'ON_PRODUCTION' },
  { id: 11, name: '', unitNumber: 'HM 10-20', equipment: "10-Station H&MU Trailer", start: '10/27', wrap: '5/15', rate: '$3,700.00/wk', po: '539', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 12, name: 'Rob Phillips', unitNumber: 'SB 12-08', equipment: 'Stakebed #1', start: '10/27', wrap: '5/15', rate: '$1,000.00/wk', po: '474', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 13, name: '', unitNumber: 'ST2-120', equipment: '2 Room Cast Trailer #1', start: '10/28', wrap: '5/11', rate: '$1,895.00/wk', po: '541', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 14, name: 'Mike Mimms', unitNumber: 'SB 12-116', equipment: 'Stakebed #2', start: '10/29', wrap: '5/15', rate: '$1,000.00/wk', po: '531', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 15, name: '', unitNumber: 'ST2-133', equipment: '2 Room Cast Trailer #2', start: '10/28', wrap: '5/11', rate: '$1,895.00/wk', po: '542', vendor: 'B.I.', notes: 'WAS ST2-132', section: 'ON_PRODUCTION' },
  { id: 16, name: 'Dominique Johnson', unitNumber: 'SV-106', equipment: 'Grip Shorty #1', start: '10/24', wrap: '5/15', rate: '$1,050.00/wk', po: '528', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 17, name: '', unitNumber: 'ST3-148', equipment: '3 Room Cast Trailer #1', start: '10/27', wrap: '5/8', rate: '$1,995.00/wk', po: '546', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 18, name: 'Marquis Abney', unitNumber: 'SV-148', equipment: 'Dolly Grip Shorty #2', start: '10/27', wrap: '5/15', rate: '$1,050.00/wk', po: '385', vendor: 'B.I.', notes: 'Re-Rate to Class A', section: 'ON_PRODUCTION' },
  { id: 19, name: '', unitNumber: 'ST3-142', equipment: '3 Room Cast Trailer #2', start: '10/30', wrap: '5/8', rate: '$1,995.00/wk', po: '547', vendor: 'B.I.', notes: 'WAS ST3-122', section: 'ON_PRODUCTION' },
  { id: 20, name: 'Charlie Ogletree', unitNumber: 'SV-107', equipment: 'Electric Shorty #3', start: '10/21', wrap: '5/15', rate: '$1,050.00/wk', po: '324', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 21, name: '', unitNumber: '', equipment: 'Sound Trailer', start: '', wrap: '', rate: 'KIT', po: '', vendor: 'Beyond Par Sound', notes: 'Re-Rate On 10/30', section: 'ON_PRODUCTION' },
  { id: 22, name: 'Mike Meadows', unitNumber: 'BD-005', equipment: '3 Axle Tractor #2', start: '10/27', wrap: '5/15', rate: '$1,050.00/wk', po: '390', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 23, name: '', unitNumber: '551-5136', equipment: "48' Grips Trailer", start: '10/27', wrap: '5/15', rate: '$950.00/wk', po: '404', vendor: 'AS YOU WISH GRIPS', notes: '', section: 'ON_PRODUCTION' },
  { id: 24, name: 'Caleb Austin', unitNumber: 'BD-006', equipment: '3 Axle Tractor #3', start: '10/21', wrap: '5/15', rate: '$1,050.00/wk', po: '392', vendor: 'B.I.', notes: 'GENNY-OP RATE', section: 'ON_PRODUCTION' },
  { id: 25, name: '', unitNumber: 'U513374', equipment: "48' Electric Trailer", start: '10/21', wrap: '5/15', rate: '$950.00/wk', po: '391', vendor: 'MAMMOTH SERVICES', notes: '6% SALES TAX', section: 'ON_PRODUCTION' },
  { id: 26, name: 'Randy Jones', unitNumber: 'SV-145', equipment: 'Art Slop Truck Shorty #4', start: '10/30', wrap: '5/12', rate: '$1,050.00/wk', po: '529', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 27, name: 'Wayne Austin', unitNumber: 'BD-004', equipment: '3 Axle Tractor #4', start: '10/20', wrap: '5/14', rate: '$1,050.00/wk', po: '281', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 28, name: 'Ernest Fears', unitNumber: 'CT-104', equipment: 'Camera 10-Ton w/ Nitrogen Tank', start: '10/27', wrap: '5/12', rate: '$1,650.00/wk', po: '473', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 29, name: 'Marcus Corley', unitNumber: 'SV-205', equipment: 'Crafty Shorty #5', start: '10/29', wrap: '5/12', rate: '$1,050.00/wk', po: '530', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 30, name: 'Marcus Womack', unitNumber: 'SV-113', equipment: 'Shorty #6', start: '12/1', wrap: '5/12', rate: '$1,050.00/wk', po: '1119', vendor: 'B.I.', notes: 'REPLACED SB 12-107', section: 'ON_PRODUCTION' },
  { id: 31, name: 'Ramiro Leiva', unitNumber: 'FT-3945 SL', equipment: '4x4 F-550 FUEL TRUCK', start: '10/27', wrap: '5/22', rate: '$950.00/wk', po: '341', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  { id: 32, name: 'Fitz Miller', unitNumber: 'SB 12-112', equipment: 'Stakebed #4', start: '10/30', wrap: '5/11', rate: '$1,000.00/wk', po: '533', vendor: 'B.I.', notes: '', section: 'ON_PRODUCTION' },
  // OFF PRODUCTION
  { id: 40, name: 'John Garner', unitNumber: 'SB 24-20', equipment: "Construction 24' Stakebed", start: '9/8', wrap: '5/27', rate: '$1,150.00/wk', po: '14', vendor: 'B.I.', notes: '', section: 'OFF_PRODUCTION' },
  { id: 41, name: 'Brazil Breaux', unitNumber: 'SD-236', equipment: 'Paint 5 Ton', start: '10/6', wrap: '5/27', rate: '$1,050.00/wk', po: '119', vendor: 'B.I.', notes: 'was SD-209', section: 'OFF_PRODUCTION' },
  { id: 42, name: 'Barry Simmons', unitNumber: 'SD-266', equipment: 'Set Dec 5 Ton #1', start: '9/22', wrap: '5/27', rate: '$1,050.00/wk', po: '51', vendor: 'B.I.', notes: '', section: 'OFF_PRODUCTION' },
  { id: 43, name: '', unitNumber: 'SD-209', equipment: 'Set Dec 5 Ton #2', start: '10/1', wrap: '5/27', rate: '$1,050.00/wk', po: '91', vendor: 'B.I.', notes: 'SWAP 223 & 231', section: 'OFF_PRODUCTION' },
  { id: 44, name: 'Darnell Fuqua', unitNumber: 'SD-222', equipment: 'Set Dec 5 Ton #3', start: '10/28', wrap: '12/10', rate: '$1,050.00/wk', po: '889', vendor: 'B.I.', notes: '', section: 'OFF_PRODUCTION' },
  { id: 45, name: 'Bart Maddox', unitNumber: 'BD001', equipment: '3 Axle Tractor #5', start: '10/8', wrap: '5/22', rate: '$1,050.00/wk', po: '121', vendor: 'B.I.', notes: 'SWAP BD-008 ON 1/7', section: 'OFF_PRODUCTION' },
  { id: 46, name: 'Willie Banks', unitNumber: 'SB 24-22', equipment: "Rigging Grip 24' Stakebed", start: '10/24', wrap: '5/22', rate: '$1,150.00/wk', po: '414', vendor: 'B.I.', notes: '', section: 'OFF_PRODUCTION' },
  { id: 47, name: 'Sam Collis', unitNumber: 'BD-009', equipment: '3 Axle Tractor #6', start: '10/8', wrap: '5/22', rate: '$1,050.00/wk', po: '120', vendor: 'B.I.', notes: 'Sam C starts 10/29', section: 'OFF_PRODUCTION' },
  { id: 48, name: 'Tim Thompson', unitNumber: 'SV-119', equipment: 'Rigging Electric Shorty #7', start: '10/27', wrap: '5/26', rate: '$1,050.00/wk', po: '386', vendor: 'B.I.', notes: '', section: 'OFF_PRODUCTION' },
  { id: 49, name: 'Kirk Rhodes', unitNumber: 'SV-136', equipment: 'Locations Shorty #8', start: '10/27', wrap: '5/15', rate: '$1,050.00/wk', po: '486', vendor: 'B.I.', notes: '', section: 'OFF_PRODUCTION' },
  { id: 50, name: 'Henri Colquit', unitNumber: 'LANDOLL-8086', equipment: 'Landoll Tractor', start: '10/13', wrap: '5/22', rate: '$3,250.00/wk', po: '214', vendor: 'B.I.', notes: '', section: 'OFF_PRODUCTION' },
  { id: 51, name: 'Jeremy Carley', unitNumber: 'TRLR20587-SL', equipment: '2 Car Hauler Trailer', start: '10/30', wrap: '5/15', rate: '$500.00/wk', po: '485', vendor: 'B.I.', notes: '', section: 'OFF_PRODUCTION' },
  // EO EQUIPMENT
  { id: 56, name: '', unitNumber: 'GEN-129', equipment: 'Tow Plant #1', start: '10/31', wrap: '5/8', rate: '$1,600.00/wk', po: '617', vendor: 'B.I.', notes: '', section: 'EO_EQUIPMENT' },
  { id: 57, name: '', unitNumber: 'GEN-114', equipment: 'Tow Plant #2', start: '10/31', wrap: '5/8', rate: '$1,600.00/wk', po: '618', vendor: 'B.I.', notes: '', section: 'EO_EQUIPMENT' },
  { id: 58, name: '', unitNumber: 'GEN-117', equipment: 'Tow Plant #3', start: '10/31', wrap: '5/8', rate: '$1,600.00/wk', po: '619', vendor: 'B.I.', notes: '', section: 'EO_EQUIPMENT' },
  { id: 59, name: '', unitNumber: 'GEN-113', equipment: 'Tow Plant #4', start: '10/31', wrap: '5/8', rate: '$1,600.00/wk', po: '620', vendor: 'B.I.', notes: '', section: 'EO_EQUIPMENT' },
  { id: 60, name: '', unitNumber: 'GEN-146', equipment: 'Tow Plant #5', start: '1/4', wrap: '5/1', rate: '', po: '1636', vendor: 'B.I.', notes: '', section: 'EO_EQUIPMENT' },
  { id: 62, name: '', unitNumber: '', equipment: 'Basecamp Package', start: '10/30', wrap: '5/11', rate: '$1,450.00/wk', po: '345', vendor: 'B.I.', notes: '', section: 'EO_EQUIPMENT' },
]

export const driversRoster: Driver[] = [
  { id: 1, name: 'Donald Thrift', union: '728', phone: '478-387-6557', email: 'teamsterdt728@gmail.com', vehicle: 'Transportation Coordinator' },
  { id: 2, name: 'Jack Herrin', union: '728', phone: '706-818-5929', email: 'transporequest@hotmail.com', vehicle: 'Transportation Captain' },
  { id: 3, name: 'Taylor Evanoff', union: '728', phone: '702-279-3440', email: 'taylorjevanoff@gmail.com', vehicle: 'Dispatcher' },
  { id: 4, name: 'Wayne Butler', union: '728', phone: '478-288-6883', email: 'jerrywbutlerjr@gmail.com', vehicle: 'DOT' },
  { id: 5, name: 'David Collis', union: '728', phone: '706-816-8500', email: 'dncollis@live.com', vehicle: 'Picture Car Coordinator' },
  { id: 6, name: 'Lance Watkins', union: '728', phone: '478-335-6149', email: 'lancewatkins@hotmail.com', vehicle: 'Picture Car Captain' },
  { id: 7, name: 'James Beato', union: '728', phone: '516-382-1694', email: 'jbeato43@comcast.net', vehicle: 'Van #1' },
  { id: 8, name: 'Trey Thrift', union: '728', phone: '706-473-3895', email: 'Treytranspo728@icloud.com', vehicle: 'Production Van #1' },
  { id: 9, name: 'Bubba Thrift', union: '728', phone: '706-473-5693', email: 'thriftbubba@gmail.com', vehicle: 'SPFX Tractor' },
  { id: 10, name: 'Jose Alfonso', union: '728', phone: '305-796-6961', email: 'jose@go4jose.com', vehicle: 'Van #3' },
  { id: 11, name: 'Brian Gregory', union: '728', phone: '912-596-0526', email: 'gregory_919@msn.com', vehicle: 'Van #2' },
  { id: 12, name: 'Joshua Outlaw', union: '728', phone: '478-256-9560', email: 'JosOu27@aol.com', vehicle: 'Van #4' },
  { id: 13, name: 'Tim Berry', union: '728', phone: '706-939-1100', email: 'berry.tim@hotmail.com', vehicle: 'Van #5' },
  { id: 14, name: 'Dominique Johnson', union: '728', phone: '405-318-6401', email: 'djohnsonwl2007@yahoo.com', vehicle: 'Grip Shorty #1' },
  { id: 15, name: 'JB Conrad', union: '728', phone: '706-318-1945', email: 'josephblakeconrad@gmail.com', vehicle: 'Dolly Grip Shorty' },
  { id: 16, name: 'JJ Lawrence', union: '728', phone: '706-347-3334', email: 'jonathonlawrence60@gmail.com', vehicle: 'Honey Wagon' },
  { id: 17, name: 'Rob Phillips', union: '728', phone: '470-572-4531', email: 'phillipsrobbie98@yahoo.com', vehicle: 'Stakebed #1' },
  { id: 18, name: 'Josh Dover', union: '728', phone: '706-499-9450', email: 'joshdover78@yahoo.com', vehicle: 'H&M' },
  { id: 19, name: 'Caleb Austin', union: '728', phone: '678-863-6850', email: 'calebaustin25@icloud.com', vehicle: '3 Axle Tractor' },
  { id: 20, name: 'Fitz Miller', union: '728', phone: '770-354-0576', email: 'iriemiller25@gmail.com', vehicle: 'Stakebed #4' },
  { id: 21, name: 'Charlie Ogletree', union: '728', phone: '404-819-6105', email: 'charlie.ogletree@yahoo.com', vehicle: 'Grip Shorty #1' },
  { id: 22, name: 'Marcus Womack', union: '728', phone: '404-839-1990', email: 'marcuswomack20@yahoo.com', vehicle: 'Crafty Shorty' },
  { id: 23, name: 'Mike Meadows', union: '728', phone: '706-473-0614', email: 'mikemeadows729@gmail.com', vehicle: 'Grips Tractor' },
  { id: 24, name: 'Randy Jones', union: '728', phone: '678-449-8765', email: 'rjns.8765@gmail.com', vehicle: 'Slop Shorty' },
  { id: 25, name: 'Ernest Fears', union: '728', phone: '404-787-5350', email: 'tddable2@hotmail.com', vehicle: 'Camera' },
  { id: 26, name: 'Brazil Breaux', union: '728', phone: '917-331-3817', email: 'Donaldbreaux01@gmail.com', vehicle: 'Paint 5 Ton' },
  { id: 27, name: 'Mike Mimms', union: '728', phone: '470-413-7941', email: 'mimsmicheal@yahoo.com', vehicle: 'Stakebed #2' },
  { id: 28, name: 'Chris Alexander', union: '728', phone: '770-864-7716', email: 'chrisalexander@gmail.com', vehicle: 'Stakebed #3' },
  { id: 29, name: 'Romiro Leiva', union: '728', phone: '786-487-1092', email: 'robertleiva1964@icloud.com', vehicle: 'Fuel Truck' },
  { id: 30, name: 'John Garner', union: '728', phone: '404-964-4436', email: 'jlg_garner@yahoo.com', vehicle: 'Construction Stakebed' },
  { id: 31, name: 'Barry Simmons', union: '728', phone: '205-212-0707', email: 'barrys60@att.net', vehicle: 'Set Dec #2' },
  { id: 32, name: 'Wayne Austin', union: '728', phone: '678-414-0637', email: 'waustin1965@yahoo.com', vehicle: 'SPFX Tractor' },
  { id: 33, name: 'Bart Maddox', union: '728', phone: '706-473-8746', email: 'bartmaddox@hotmail.com', vehicle: 'Rigging Grip Tractor' },
  { id: 34, name: 'Willie Banks', union: '728', phone: '404-723-2113', email: 'williegbanks@aol.com', vehicle: 'Rigging Grip Stakebed' },
  { id: 35, name: 'Sam Collis', union: '728', phone: '706-473-5311', email: 'collissam@yahoo.com', vehicle: 'Rigging Electric Tractor' },
  { id: 36, name: 'Tim Thompson', union: '728', phone: '404-914-3557', email: 'ththompson1965@gmail.com', vehicle: 'Rigging Electric Shorty' },
  { id: 37, name: 'Kirk Rhodes', union: '728', phone: '504-307-5517', email: 'kirkrhodes66@gmail.com', vehicle: 'Locations Shorty' },
  { id: 38, name: 'Henri Colquitt', union: '728', phone: '770-688-9648', email: 'colquittconcrete@yahoo.com', vehicle: 'Landoll' },
  { id: 39, name: 'Mitch Bell', union: '728', phone: '706-473-9065', email: '306spiderman@gmail.com', vehicle: 'Car Hauler' },
  { id: 40, name: 'Lord Ajmer', union: '728', phone: '770-369-7660', email: 'doctor.lord@gmail.com', vehicle: 'Set Dec #1' },
]

// Onboarding activity data derived from call sheet start dates
export const onboardingActivity = [
  { date: 'Sep 1', drivers: 2 },
  { date: 'Sep 15', drivers: 3 },
  { date: 'Oct 1', drivers: 6 },
  { date: 'Oct 8', drivers: 10 },
  { date: 'Oct 13', drivers: 13 },
  { date: 'Oct 20', drivers: 18 },
  { date: 'Oct 27', drivers: 28 },
  { date: 'Oct 30', drivers: 38 },
  { date: 'Nov 1', drivers: 40 },
  { date: 'Nov 14', drivers: 43 },
  { date: 'Dec 1', drivers: 45 },
  { date: 'Dec 15', drivers: 47 },
  { date: 'Jan 1', drivers: 50 },
  { date: 'Jan 14', drivers: 54 },
  { date: 'Feb 1', drivers: 58 },
  { date: 'Feb 13', drivers: 60 },
]

export const statsData = {
  activeDrivers: 40,
  totalVehicles: 63,
  weeklyBudget: 68500,
  newApplications: 0,
}
