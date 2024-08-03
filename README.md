
<img src="https://github.com/user-attachments/assets/e718fd19-b6d0-446c-ba8a-a905fbc9ac9c" width="200" alt="replica logo">
  
# Replica: Advanced Scientific Analysis and Replication Platform

Replica is a full-stack application designed to empower researchers to validate and replicate scientific analyses. By leveraging cutting-edge, off-the-shelf technologies in bioinformatics and machine learning, Replica offers a platform for simplified protein structure prediction, gene expression analysis, gene set enrichment analysis, and more.

This is a student project and is not intended at this time for research purposes or mission-critical applications. 

## Features

- User authentication and project management
- Data file upload and metadata management
- Differential gene expression analysis using DESeq2
- Gene Set Enrichment Analysis (GSEA)
- Protein structure prediction using state-of-the-art ML models (ESM-2, ProtTrans)
- Visualizations for analysis results
- RESTful API for seamless integration with other tools

## Prerequisites

Ensure you have the following installed on your system:
- Python 3.9
- Node.js 14+
- npm 6+
- Anaconda or Miniconda

## Installation

### Backend Setup

1. Clone the repository:

```
git clone https://github.com/your-username/replica.git
cd replica
```

2. Create and activate a Conda environment:

```
conda create -n replica python=3.9
conda activate replica
```

3. Install dependencies using Conda and pip:

```
conda install -c conda-forge -c bioconda pandas numpy matplotlib seaborn scipy biopython
pip install django djangorestframework django-cors-headers pydeseq2 gseapy torch transformers esm
```

4. Load database fixtures:

```
chmod +x ./seed_data.sh
./seed_data.sh
```

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:

```
cd replica-client
npm install
```

## Running the Application

1. Start the Django development server:

```
cd ..
python manage.py runserver
```

2. In a new terminal, start the React development server:

```
cd replica-client
npm run dev
```

3. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

## Project Structure

replica/  
├── api/                    # Django backend  
│   ├── management/         # Custom management commands  
│   ├── migrations/         # Database migrations  
│   ├── models/             # Django models  
│   ├── serializers/        # DRF serializers  
│   ├── views/              # API views  
│   └── urls.py             # API URL routing  
├── replica-client/         # React frontend  
│   ├── src/  
│   │   ├── components/     # React components  
│   │   ├── services/       # API service functions  
│   │   └── views/          # Page components  
│   ├── public/             # Static assets  
│   └── index.html          # HTML entry point  
├── manage.py               # Django management script  
└── README.md               # This file  

## Usage

1. Create a new account or log in to the default one.
2. Projects and their associated Analyses can be found under the Projects tab.
   
![replica](https://github.com/user-attachments/assets/27c69af6-9c8a-4377-83f8-62ba5303bfb0)

3. Create a new project and upload your data files (CSV for gene expression, FASTA for protein sequences).
4. Select the desired analysis type (DESeq2, DESeq2/GSEA, or Protein Prediction).
5. Configure analysis parameters and run the analysis.

<img width="998" alt="Screenshot 2024-08-03 at 6 03 39 PM" src="https://github.com/user-attachments/assets/26c64e04-f287-4b22-944f-eadda73d1f43">

6. View and interpret the results through summary data & visualizations.

<img width="1305" alt="Screenshot 2024-08-03 at 6 04 35 PM" src="https://github.com/user-attachments/assets/d20b82a0-f764-4123-8ce6-974236795c1c">


## Contributing

Please reach out if you would like to consider making a contribution.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [DESeq2](https://bioconductor.org/packages/release/bioc/html/DESeq2.html)
- [PyDESeq2](https://pubmed.ncbi.nlm.nih.gov/37669147/)
- [GSEA](https://www.gsea-msigdb.org/gsea/index.jsp)
- [ESM](https://github.com/facebookresearch/esm)
- [ProtTrans](https://github.com/agemagician/ProtTrans)
- [Mark Sanborn](https://github.com/mousepixels/sanbomics_scripts/blob/main/PyDeseq2_DE_tutorial.ipynb)
- [Krueger et al](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE171663)
- [Transformers](https://github.com/huggingface/transformers)
- [Pressmaster](https://www.pexels.com/@pressmaster/)
