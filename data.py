from bigquery import client
import csv

# BigQuery project id as listed in the Google Developers Console.
project_id = ''

# Service account email address as listed in the Google Developers Console.
service_account = ''

# PKCS12 or PEM key provided by Google.
with open('') as fp:
    key = fp.read()


client = client.get_client(project_id, service_account=service_account,
                        private_key=key, readonly=True)
def getData(cty_code):
    # Submit a query.
    job_id, results = client.query("""
                        SELECT Source, Target, Year, QuadClass, Count(EventCode) as ECount, SUM(NumSources) as NSources, MAX(NumSources) as MaxSources, AVG(NumSources) as AvgSources, STDDEV(NumSources) as StdDevSources
                        FROM
                            (
                                SELECT  Actor1CountryCode as Source, Actor2CountryCode as Target, Year, QuadClass,EventCode,NumSources
                                FROM [gdelt-bq:full.events]
                                WHERE (Actor1CountryCode = '%s') AND (Actor1CountryCode != Actor2CountryCode)
                            ),
                            (
                                SELECT  Actor2CountryCode as Source, Actor1CountryCode as Target, Year, QuadClass,EventCode,NumSources
                                FROM [gdelt-bq:full.events]
                                WHERE (Actor2CountryCode = '%s') AND (Actor2CountryCode != Actor1CountryCode)
                            )
                        GROUP BY Source, Target, Year, QuadClass ORDER BY AvgSources DESC;
                        """ % (cty_code, cty_code))

    # Check if the query has finished running.
    complete, row_count = client.check_job(job_id)

    # Retrieve the results.
    results = client.get_query_rows(job_id)

    # print results

    with open(cty_code+'.csv', 'w') as output_file:
        w = csv.DictWriter(output_file, results[0].keys())
        w.writeheader()
        w.writerows(results)

codes = ["USA","CHN","IND","AFG","BRA","FRA","GBR","IRN","IRQ","PAK","ISR","RUS","ZAF","AUS"]
for code in codes:
    getData(code)





