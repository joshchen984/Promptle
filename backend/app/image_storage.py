from azure.storage.blob import BlobServiceClient
from PIL import Image
from urllib.request import urlopen
import uuid
import os


def save_image_cloud(image_url):
    image = Image.open(urlopen(image_url))
    image = image.convert("RGB")
    filename = uuid.uuid4().hex
    file_path = f"{os.getcwd()}/app/tmp/{filename}.webp"
    image.save(file_path, "webp", optimize=True, quality=85)
    blob_service_client = BlobServiceClient.from_connection_string(
        os.environ.get("AZURE_CONNECTION_STRING")
    )
    blob_client = blob_service_client.get_blob_client(
        container=os.environ.get("AZURE_CONTAINER_NAME"), blob=f"{filename}.webp"
    )
    try:
        with open(file_path, "rb") as data:
            blob_client.upload_blob(data)
    finally:
        os.remove(file_path)

    return blob_client.url
