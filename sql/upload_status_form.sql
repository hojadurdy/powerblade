
#load data local infile 'C:/Users/Sam/Downloads/pb.csv' into table inf_pb_lookup fields terminated by ',' (deviceMAC, deviceName, category, deviceType, location, permanent, startTime, endTime);
#load data local infile 'C:/Users/Sam/Downloads/gw.csv' into table inf_gw_lookup fields terminated by ',' (gatewayMAC, location, startTime, endTime);

load data local infile '/Users/sdebruin/Downloads/PowerBlades.csv' into table inf_pb_lookup fields terminated by ',' (deviceMAC, deviceName, category, deviceType, permanent, room, location, startTime, remTime, endTime);
load data local infile '/Users/sdebruin/Downloads/Gateways.csv' into table inf_gw_lookup fields terminated by ',' (gatewayMAC, room, location, startTime, remTime, endTime);
load data local infile '/Users/sdebruin/Downloads/Blinks.csv' into table inf_blink_lookup fields terminated by ',' (deviceMAC, room, location, startTime, remTIme, endTime);
load data local infile '/Users/sdebruin/Downloads/BLEES.csv' into table inf_light_lookup fields terminated by ',' (deviceMAC, deviceName, power, deviceType, room, location, startTime, remTime, endTime);

load data local infile 'C:/Users/Sam/Downloads/PowerBlades.csv' into table inf_pb_lookup fields terminated by ',' (deviceMAC, deviceName, category, deviceType, permanent, room, location, startTime, remTime, endTime);
load data local infile 'C:/Users/Sam/Downloads/Gateways.csv' into table inf_gw_lookup fields terminated by ',' (gatewayMAC, room, location, startTime, remTime, endTime);
load data local infile 'C:/Users/Sam/Downloads/Blinks.csv' into table inf_blink_lookup fields terminated by ',' (deviceMAC, room, location, startTime, remTIme, endTime);
load data local infile 'C:/Users/Sam/Downloads/BLEES.csv' into table inf_light_lookup fields terminated by ',' (deviceMAC, deviceName, power, deviceType, room, location, startTime, remTime, endTime);

load data local infile '/Users/sdebruin/Downloads/GndTruth.csv' into table dat_gnd_truth fields terminated by ',' (location, dayst, energy);
load data local infile 'C:/Users/Sam/Downloads/GndTruth.csv' into table dat_gnd_truth fields terminated by ',' (location, dayst, energy);






