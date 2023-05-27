import pdfkit

WKHTMLTOPDF_PATH = 'pdf.pdf'

pdfkit_config = pdfkit.configuration(wkhtmltopdf=WKHTMLTOPDF_PATH)
