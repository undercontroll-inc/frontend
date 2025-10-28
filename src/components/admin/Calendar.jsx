import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, LogOut } from "lucide-react";
import SideBar from "../shared/SideBar";
import Loading from "../shared/Loading";
import Card from "../shared/Card";
import PageContainer from "../shared/PageContainer";

const Calendar = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard - Calendário";
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading text="Carregando calendário..." />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SideBar active="calendar" />

      <div className="flex-1 overflow-y-auto">
        <PageContainer>
          {/* Header */}
          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 text-xl font-bold mb-2 flex items-center gap-3">
                  <CalendarIcon className="h-8 w-8" />
                  Calendário de Agendamentos
                </h1>
                <p className="text-gray-600">
                  Visualize e gerencie os agendamentos e compromissos
                </p>
              </div>
            </div>
          </Card>

          {/* Calendar Container */}
          <Card>
            <div className="w-full">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Google Calendar
                </h2>
                <p className="text-sm text-gray-600">
                  Calendário integrado com eventos e feriados do Brasil
                </p>
              </div>
              
              {/* Google Calendar Embed */}
              <div className="relative w-full overflow-hidden rounded-lg border border-gray-300 shadow-sm">
                <div className="w-full" style={{ paddingBottom: '75%', position: 'relative' }}>
                  <iframe
                    src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FSao_Paulo&showPrint=0&mode=MONTH&src=ZnVycXVpbW1zd0BnbWFpbC5jb20&src=cHQuYnJhemlsaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=cHQtYnIuYnJhemlsaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039be5&color=%230b8043&color=%230b8043"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    title="Google Calendar"
                    frameBorder="0"
                    scrolling="no"
                  />
                </div>
              </div>

              {/* Info adicional */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      Calendário Sincronizado
                    </h4>
                    <p className="text-xs text-blue-800">
                      Este calendário está sincronizado com o Google Calendar e inclui feriados brasileiros.
                      Todos os eventos são atualizados automaticamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </PageContainer>
      </div>
    </div>
  );
};

export default Calendar;
