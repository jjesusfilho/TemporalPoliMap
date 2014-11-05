from bigquery import client
import csv
from auth_settings import *


client = client.get_client(project_id, service_account=service_account,
                        private_key=key, readonly=True)
def getData(cty_code):
    global client
    # Submit a query.
    job_id, results = client.query("""
                        SELECT Source, Target, Year, QuadClass, Count(EventCode) as ECount, SUM(NumSources) as NSources, MAX(NumSources) as MaxSources, AVG(NumSources) as AvgSources, STDDEV(NumSources) as StdDevSources
                        FROM
                            (
                                SELECT  Actor1CountryCode as Source, Actor2CountryCode as Target, Year, QuadClass,EventCode,NumSources
                                FROM [gdelt-bq:full.events]
                                WHERE (Actor1CountryCode = '%s') AND (Actor1CountryCode != Actor2CountryCode)
                                AND (Actor1Type1Code = "GOV" OR Actor1Type2Code = "GOV" OR Actor1Type3Code = "GOV")
                            ),
                            (
                                SELECT  Actor2CountryCode as Source, Actor1CountryCode as Target, Year, QuadClass,EventCode,NumSources
                                FROM [gdelt-bq:full.events]
                                WHERE (Actor2CountryCode = '%s') AND (Actor2CountryCode != Actor1CountryCode)
                                AND (Actor2Type1Code = "GOV" OR Actor2Type2Code = "GOV" OR Actor2Type3Code = "GOV")
                            )
                        GROUP BY Source, Target, Year, QuadClass ORDER BY MaxSources DESC;
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

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Call Google bigquery api to fetch data.')
    parser.add_argument('--all', help='fetch data for all countries')
    parser.add_argument('-c', type=str, nargs='+', help='fetch data for the 3 letter country code given.')
    args = parser.parse_args()
    if args.all is None and args.c == '' or args.c is None:
        parser.print_help()
    if args.all:
        codes = ["USA","CHN","IND","AFG","BRA","FRA","GBR","IRN","IRQ","PAK","ISR","RUS","ZAF","AUS", "GRC"]
        print "Downloading data for following countries: ", codes
        for code in codes:
            getData(code)
    if args.c != '' or args.c is not None:
        codes = args.c
        print "Downloading data for following countries: ", codes
        getData(args.c)
    print "Done"