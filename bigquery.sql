
SELECT Actor1CountryCode, Actor2CountryCode, Year, Count(EventCode) as ECount, AVERAGE(QuadClass) as AvgQuadClass
FROM [gdelt-bq:full.events]
WHERE (Actor1CountryCode = 'USA' OR Actor2CountryCode = 'USA') AND (Actor1CountryCode != Actor2CountryCode)
GROUP BY Actor1CountryCode, Actor2CountryCode, Year;

SELECT Actor1CountryCode, Actor2CountryCode, Year, QuadClass, Count(EventCode) as ECount
FROM [gdelt-bq:full.events]
WHERE (Actor1CountryCode = 'USA' OR Actor2CountryCode = 'USA') AND (Actor1CountryCode != Actor2CountryCode)
GROUP BY Actor1CountryCode, Actor2CountryCode, Year, QuadClass;


SELECT Actor1CountryCode, Actor2CountryCode, Year, QuadClass, Count(EventCode) as ECount FROM [gdelt-bq:full.events] WHERE (Actor1CountryCode = 'USA' OR Actor2CountryCode = 'USA') AND (Actor1CountryCode != Actor2CountryCode) GROUP BY Actor1CountryCode, Actor2CountryCode, Year, QuadClass;

SELECT Actor1Geo_CountryCode, Actor2Geo_CountryCode, Year, QuadClass, Count(EventCode) as ECount
FROM [gdelt-bq:full.events]
WHERE (Actor1Geo_CountryCode = 'US' OR Actor2Geo_CountryCode = 'US') AND (Actor1Geo_CountryCode != Actor2Geo_CountryCode)
GROUP BY Actor1Geo_CountryCode, Actor2Geo_CountryCode, Year, QuadClass;

SELECT Actor1Geo_CountryCode, Actor2Geo_CountryCode, Year, QuadClass, Count(EventCode) as ECount FROM [gdelt-bq:full.events] WHERE (Actor1Geo_CountryCode = 'US' OR Actor2Geo_CountryCode = 'US') AND (Actor1Geo_CountryCode != Actor2Geo_CountryCode) GROUP BY Actor1Geo_CountryCode, Actor2Geo_CountryCode, Year, QuadClass;


# Final Query for 3 charector country codes.
SELECT Source, Target, Year, QuadClass, Count(EventCode) as ECount, SUM(NumSources) as NSources, AVG(NumSources) as AvgSources, STDDEV(NumSources) as StdDevSources
FROM
	(
		SELECT  Actor1CountryCode as Source, Actor2CountryCode as Target, Year, QuadClass,EventCode,NumSources
		FROM [gdelt-bq:full.events]
		WHERE (Actor1CountryCode = 'USA') AND (Actor1CountryCode != Actor2CountryCode)
	),
	(
		SELECT  Actor2CountryCode as Source, Actor1CountryCode as Target, Year, QuadClass,EventCode,NumSources
		FROM [gdelt-bq:full.events]
		WHERE (Actor2CountryCode = 'USA') AND (Actor2CountryCode != Actor1CountryCode)
	)
GROUP BY Source, Target, Year, QuadClass ORDER BY AvgSources DESC;
