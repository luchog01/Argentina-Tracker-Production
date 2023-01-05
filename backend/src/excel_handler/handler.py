import pandas as pd
import os

files_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "files")

if not os.path.exists(files_folder):
    os.makedirs(os.path.join(files_folder))

def get_excel(ticker: int) -> str:
    file_path = os.path.join(files_folder,f"{ticker}.xlsx")
    return file_path

def update_excel(funds_data: dict, fecha: str) -> None:
    for key in funds_data.keys():
        file_path = os.path.join(files_folder,f"{key}.xlsx")
        try:
            old_df = pd.read_excel(file_path, index_col=0)
        except FileNotFoundError:
            old_df = pd.DataFrame()

        update_df = funds_data[key]
        update_df = pd.DataFrame(update_df)
        update_df.drop("price", axis=0, inplace=True)
        update_df = update_df.transpose()
        update_df.rename(columns={"qty": fecha}, inplace=True)

        try:
            update_df = old_df.join(update_df, how="outer", sort=True)
            
            update_df.to_excel(file_path)
            print("[OK] [file_handler.py] Excel saved")
        except ValueError:
            print("[ERROR] [file_handler.py] ValueError when joining dataframes")