import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processed, setProcessed] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(['vocals']);

  const instruments = [
    { id: 'vocals', name: 'Вокал', icon: 'Mic2', color: 'text-primary' },
    { id: 'drums', name: 'Барабаны', icon: 'Drum', color: 'text-secondary' },
    { id: 'bass', name: 'Бас', icon: 'Music4', color: 'text-accent' },
    { id: 'guitar', name: 'Гитара', icon: 'Music2', color: 'text-primary' },
    { id: 'piano', name: 'Фортепиано', icon: 'Piano', color: 'text-secondary' },
    { id: 'other', name: 'Прочее', icon: 'Music', color: 'text-accent' },
  ];

  const features = [
    {
      icon: 'Wand2',
      title: 'ИИ-разделение',
      description: 'Нейросеть точно извлекает каждый инструмент из микса'
    },
    {
      icon: 'Headphones',
      title: 'Студийное качество',
      description: 'Сохраняем оригинальное качество звука без артефактов'
    },
    {
      icon: 'Zap',
      title: 'Мгновенная обработка',
      description: 'Получите результат за несколько секунд'
    },
    {
      icon: 'Download',
      title: 'Все форматы',
      description: 'Экспорт в MP3, WAV, FLAC и другие форматы'
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = () => {
    setProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setProcessed(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const toggleInstrument = (id: string) => {
    setSelectedInstruments(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <nav className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Music" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold gradient-text">StemSplit</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
              <Icon name="HelpCircle" size={20} className="mr-2" />
              Помощь
            </Button>
            <Button className="bg-primary hover:bg-primary/90 glow-purple">
              Войти
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center animate-fade-in">
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-12 bg-primary rounded-full wave-animation"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
            Извлекайте инструменты из любого трека
          </h2>
          
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Мощная нейросеть разделит вашу композицию на отдельные дорожки за считанные секунды
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50">
              <Icon name="Check" size={16} className="text-primary" />
              <span className="text-sm">Без регистрации</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50">
              <Icon name="Check" size={16} className="text-primary" />
              <span className="text-sm">До 10 минут</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50">
              <Icon name="Check" size={16} className="text-primary" />
              <span className="text-sm">Любой формат</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 glow-purple">
            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-border/50 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="audio/*"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Загрузите аудиофайл</h3>
                  <p className="text-foreground/60 mb-4">
                    Перетащите файл сюда или нажмите для выбора
                  </p>
                  <p className="text-sm text-foreground/50">
                    MP3, WAV, FLAC • До 100 МБ
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="FileAudio" size={24} className="text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-foreground/60">
                        {(file.size / 1024 / 1024).toFixed(2)} МБ
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setProcessed(false);
                      setProgress(0);
                    }}
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </div>

                {!processed && !processing && (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Выберите инструменты для извлечения</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {instruments.map(inst => (
                          <button
                            key={inst.id}
                            onClick={() => toggleInstrument(inst.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              selectedInstruments.includes(inst.id)
                                ? 'border-primary bg-primary/10'
                                : 'border-border/50 hover:border-border'
                            }`}
                          >
                            <Icon name={inst.icon} className={inst.color} size={24} />
                            <p className="mt-2 font-medium">{inst.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleProcess}
                      className="w-full bg-primary hover:bg-primary/90 glow-purple"
                      size="lg"
                      disabled={selectedInstruments.length === 0}
                    >
                      <Icon name="Sparkles" size={20} className="mr-2" />
                      Обработать трек
                    </Button>
                  </>
                )}

                {processing && (
                  <div className="space-y-4 py-8">
                    <div className="text-center">
                      <Icon name="Loader2" size={48} className="mx-auto mb-4 text-primary animate-spin" />
                      <h4 className="text-xl font-semibold mb-2">Обрабатываем ваш трек</h4>
                      <p className="text-foreground/60">Нейросеть анализирует аудио...</p>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-center text-sm text-foreground/60">{progress}%</p>
                  </div>
                )}

                {processed && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/50 rounded-lg">
                      <Icon name="CheckCircle2" size={24} className="text-primary" />
                      <div>
                        <p className="font-semibold">Готово!</p>
                        <p className="text-sm text-foreground/70">Все дорожки успешно извлечены</p>
                      </div>
                    </div>

                    <Tabs defaultValue="vocals" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="vocals">Вокал</TabsTrigger>
                        <TabsTrigger value="drums">Барабаны</TabsTrigger>
                        <TabsTrigger value="bass">Бас</TabsTrigger>
                      </TabsList>
                      {['vocals', 'drums', 'bass'].map(type => (
                        <TabsContent key={type} value={type} className="space-y-3">
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Icon name="Play" size={20} className="text-primary" />
                                <span className="font-medium capitalize">{type === 'vocals' ? 'Вокал' : type === 'drums' ? 'Барабаны' : 'Бас'}.wav</span>
                              </div>
                              <span className="text-sm text-foreground/60">3:24</span>
                            </div>
                            <div className="h-16 flex items-end gap-1">
                              {[...Array(50)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 bg-primary/60 rounded-sm"
                                  style={{ height: `${Math.random() * 100}%` }}
                                />
                              ))}
                            </div>
                          </div>
                          <Button className="w-full" variant="outline">
                            <Icon name="Download" size={20} className="mr-2" />
                            Скачать дорожку
                          </Button>
                        </TabsContent>
                      ))}
                    </Tabs>

                    <Button
                      onClick={() => {
                        setFile(null);
                        setProcessed(false);
                        setProgress(0);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Обработать новый трек
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </section>

      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Возможности сервиса
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Icon name={feature.icon} size={32} className="text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-foreground/70">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-3xl">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Частые вопросы
          </h3>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="1" className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-lg hover:no-underline">
                Как работает разделение инструментов?
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                Мы используем передовые алгоритмы машинного обучения, обученные на миллионах треков. 
                Нейросеть анализирует спектральные характеристики аудио и разделяет его на отдельные источники звука.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="2" className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-lg hover:no-underline">
                Какие форматы поддерживаются?
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                Мы поддерживаем все популярные аудиоформаты: MP3, WAV, FLAC, OGG, M4A, AAC и другие. 
                Результат можно экспортировать в любом из этих форматов.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="3" className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-lg hover:no-underline">
                Есть ли ограничения на размер файла?
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                Бесплатная версия поддерживает файлы до 100 МБ и длительностью до 10 минут. 
                Премиум-версия снимает эти ограничения.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="4" className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-lg hover:no-underline">
                Сохраняется ли качество звука?
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                Да! Мы обрабатываем аудио с максимальным качеством и не применяем дополнительное сжатие. 
                Выходные файлы сохраняют студийное качество исходника.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/50 py-8 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Music" className="text-primary" size={24} />
            <span className="font-bold gradient-text">StemSplit</span>
          </div>
          <p className="text-foreground/60 text-sm">
            © 2024 StemSplit. Разделяем музыку на части
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">
              <Icon name="Mail" size={18} />
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="Github" size={18} />
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="Twitter" size={18} />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
