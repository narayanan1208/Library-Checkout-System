import pandas as pd

def excel_to_csv(filename):
    df = pd.read_excel(filename, sheet_name=None)

    for key, value in df.items():
        df[key].to_csv('./db_csvs/%s.csv' % key, index=False)
        print('Completed: ' + key)

if __name__ == '__main__':
    filename = 'db_build.xlsx'

    excel_to_csv(filename)