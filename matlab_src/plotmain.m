function plotmain(inputfile,outputfile, dtquit)
    % Example: plotmain('debug','temp') runs the temp output from the debug
    % input file
    [x, y, dtout] = readinput(inputfile); % gets mesh and dtout
    scale = 1000; % dtout scale
    
    gifname = sprintf('%s_%s.gif', outputfile, inputfile); % name of gif
    command = sprintf('rm %s', gifname); % deletes old
    system(command); % does above
    
    filedir = sprintf("../outputs/%s.o",outputfile); % output file dir
    fid = fopen(filedir); % opens file
    
  %  if(outputfile(1:4) == 'temp')
        [O, Omin, Omax, N] = getoutput(outputfile); % gets min/max Temp for scale
  %  end
    
%     i = 1;
    h = figure;
    set(gcf, 'Units', 'Normalized', 'OuterPosition', [0.1, 0.1, .6, 0.8]);
    set(gcf,'color','w');
    
%     while ~feof(fid)
    for i = 1:N
        % O = fgetmat(fid); % gets output matrix at every time-step
        surf(x,y,O(:,:,i)); 
        if(i == 1)
            if(outputfile(1:4) == 'temp') % no colorbar if phase
                c = colorbar;
                ylc = ylabel(c, 'Temperature (K)', 'FontSize', 20, 'Rotation', 270);
                posy = get(ylc, 'Position');
                set(ylc, 'Position', posy + [2, (Omax-Omin)/2 - posy(2), 0]);
                caxis([Omin Omax]);
                ylabel('Y Dimension (m)');
                xlabel('X Dimension (m)');   
            elseif(outputfile(1:5) == 'phase')
                ylabel('Y Dimension (m)');
                xlabel('X Dimension (m)');
            end
        end
        
        titstr = sprintf('time elapsed = %f s', (i-1)*dtout);
        if(outputfile(1:4) == 'temp') % no colorbar if phase
            titstr = sprintf('Temperature, %s', titstr);
            title(titstr);
        elseif(outputfile(1:5) == 'phase')
            titstr = sprintf('Phase, %s', titstr);
            title(titstr)
        end
        set(gca, 'FontSize', 20);
        colormap jet
        shading interp;
        view(0,90);
        hold on;
        %pause(dtout/scale); % time accurate plot
        
        gifmaker(gifname, h, i); % saves gif
        if((i-1)*dtout > dtquit) % break at steady state
            break;
        end
        
    %    i = i + 1;
    end
    fclose(fid);
end