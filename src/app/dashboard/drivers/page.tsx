import { getGoogleAuthUrl } from './actions';

export default function DriversPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Conectar Fontes de Documentos</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Google Drive</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          Conecte sua conta do Google Drive para permitir que o WISEIA leia
          e analise seus documentos de forma segura.
        </p>
        
        {/* O formulário chama a nossa Server Action */}
        <form action={getGoogleAuthUrl}>
          <button 
            type="submit" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Conectar com Google Drive
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-semibold">Microsoft OneDrive</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          (Integração com OneDrive em breve)
        </p>
        <button 
          disabled 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-secondary text-secondary-foreground opacity-50 cursor-not-allowed"
        >
          Conectar com OneDrive
        </button>
      </div>
    </div>
  );
}