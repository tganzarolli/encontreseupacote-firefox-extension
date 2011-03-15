function encontrePacoteClick(event)
{

	if (event.button != 0) 
	{
		return;
	}
    else 
    {
		toggleSidebar('viewencontreseupacoteSideBar');
	}
}

function openPrefs()
{
	openDialog("chrome://encontreseupacote/content/prefPaneWindow.xul", "Opções Encontre Seu Pacote", "", null);
}

function openShortcuts()
{
	openDialog("chrome://encontreseupacote/content/shortcuts.xul", "Atalhos Encontre Seu Pacote", "centerscreen,width=280px,height=130px", null);
}