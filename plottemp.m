MM = 100;
MM = MM-1;
a = 0;
b = 1;
dx = 1/MM;
% k = 20;
M = MM*(b-a);

[x,y] = meshgrid(a:dx:b);
% [xq, yq] = meshgrid(a:dx/k:b);
%% LETS MAKE A MOVIE
fid = fopen("temp.o");
i = 1;
h = figure;
%axis tight manual % this ensures that getframe() returns a consistent size
filename = 'testAnimated.gif';
while ~feof(fid)
    %% READ CURRENT TEMP
    T = fgetmat(fid);
    %% PLOT TEMPERATURE 
    surf(x,y,T); 
    colorbar;
    caxis([0 1]);
    colormap jet
    shading interp;
    view(0,90);
    if i == 1
        pause(1);
    end
    pause(0.0004);
          % Capture the plot as an image 
      frame = getframe(h); 
      im = frame2im(frame); 
      [imind,cm] = rgb2ind(im,256); 
      % Write to the GIF File 
      if i == 1 
          imwrite(imind,cm,filename,'gif', 'Loopcount',inf, 'WriteMode','overwrite'); 
      else 
          imwrite(imind,cm,filename,'gif','WriteMode','append'); 
      end 
       i = i + 1;
end
fclose(fid);