# Index creation for data tables

alter table dat_powerblade add index (timestamp);
alter table dat_powerblade add index (gatewayMAC);
alter table dat_powerblade add index (deviceMAC);
alter table dat_powerblade add index (power);


alter table dat_powerblade add index devEnergy (timestamp, deviceMAC, energy);
alter table dat_powerblade add index devPower (timestamp, deviceMAC, power);

alter table dat_powerblade add index devDevPower (deviceMAC, power, timestamp);

alter table dat_powerblade add index devTimePower (deviceMAC, timestamp, power);

alter table dat_powerblade add index devDevEnergy (deviceMAC, energy, timestamp);

alter table dat_powerblade add index devTimeEnergy (deviceMAC, timestamp, energy);

alter table dat_blees add index devLux (deviceMAC, lux, timestamp);

alter table dat_powerblade add index devTimeSeq (deviceMAC, timestamp, seq);
alter table dat_powerblade add index devDevSeq (deviceMAC, seq, timestamp);

alter table dat_blink add index devMin (timestamp, deviceMAC, minMot);

alter table dat_powerblade drop index devEnergy;

alter table dat_powerblade add index devPowTimeSeq (deviceMAC, power, timestamp, seq);


describe dat_occ_pb;
alter table dat_occ_pb add index devTime (deviceMAC, tsMin);
alter table dat_occ_blink add index devTime (deviceMAC, tsMin);

describe inf_pb_lookup;
alter table inf_pb_lookup add index devLoc (deviceMAC, location);
